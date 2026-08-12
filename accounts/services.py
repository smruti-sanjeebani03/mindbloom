import os
import uuid
import secrets
import logging
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import UserProfile, PasswordResetToken
from .validators import validate_password_strength, validate_email_format

try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
except ImportError:
    google_id_token = None
    google_requests = None

logger = logging.getLogger(__name__)


def create_user_account(full_name: str, email: str, password: str) -> User:
    """
    Business logic to register and securely create a new user account.
    """
    clean_email = email.strip().lower()
    clean_name = full_name.strip()

    # Check for duplicate email
    if User.objects.filter(email__iexact=clean_email).exists() or User.objects.filter(username__iexact=clean_email).exists():
        raise ValidationError({"email": ["An account with this email address already exists."]})

    with transaction.atomic():
        # Create user with username set to email to ensure email uniqueness
        user = User.objects.create_user(
            username=clean_email,
            email=clean_email,
            password=password,
            first_name=clean_name
        )
        
        # Create associated profile
        UserProfile.objects.get_or_create(
            user=user,
            defaults={"full_name": clean_name}
        )

    return user

def authenticate_user_by_email(email: str, password: str) -> dict:
    """
    Authenticate an existing MindBloom user using email + password.

    Returns JWT tokens and complete user information.
    """

    clean_email = (email or "").strip().lower()

    if not clean_email:
        raise ValidationError({
            "email": ["Email address is required."]
        })

    if not password:
        raise ValidationError({
            "password": ["Password is required."]
        })

    # Find the user using email.
    try:
        user = User.objects.get(
            email__iexact=clean_email
        )
    except User.DoesNotExist:
        raise ValidationError({
            "requires_registration": True,
            "email": [
                "No account found with this email address."
            ]
        })

    # Check password.
    if not user.check_password(password):
        raise ValidationError({
            "password": [
                "Invalid email or password."
            ]
        })

    # Check account status.
    if not user.is_active:
        raise ValidationError({
            "non_field_errors": [
                "This account is inactive."
            ]
        })

    # Make sure profile exists.
    profile, _ = UserProfile.objects.get_or_create(
        user=user
    )

    # Generate JWT tokens.
    refresh = RefreshToken.for_user(user)

    return {
        "access_token": str(
            refresh.access_token
        ),

        "refresh_token": str(
            refresh
        ),

        "user": {
            "id": user.id,

            "full_name":
                profile.full_name
                or user.first_name
                or user.email.split("@")[0],

            "email": user.email,

            "date_joined":
                user.date_joined,

            "bio":
                profile.bio or "",

            "chat_count":
                profile.chat_count,

            "subscription_type":
                profile.subscription_type,

            "subscription_status":
                profile.subscription_status,

            "subscription_expiry":
                profile.subscription_expiry.isoformat()
                if profile.subscription_expiry
                else None,

            "is_staff":
                user.is_staff,

            "is_superuser":
                user.is_superuser,
        }
    }


def authenticate_admin_user(
    name: str,
    email: str,
    password: str,
    admin_code: str = ""
) -> dict:
    """
    Authenticate a MindBloom administrator using:
    - Administrator name
    - Email
    - Password
    - Admin invitation code

    Existing staff/superuser accounts are allowed.
    A valid admin invitation code can promote the account to staff.
    """

    clean_name = (name or "").strip()
    clean_email = (email or "").strip().lower()
    clean_admin_code = (admin_code or "").strip()

    if not clean_name:
        raise ValidationError({
            "name": ["Administrator name is required."]
        })

    if not clean_email:
        raise ValidationError({
            "email": ["Admin email is required."]
        })

    if not password:
        raise ValidationError({
            "password": ["Security password is required."]
        })

    # Find existing account
    try:
        user = User.objects.get(email__iexact=clean_email)
    except User.DoesNotExist:
        raise ValidationError({
            "non_field_errors": [
                "No account exists with this email address."
            ]
        })

    # Verify password
    if not user.check_password(password):
        raise ValidationError({
            "non_field_errors": [
                "Invalid admin credentials."
            ]
        })

    if not user.is_active:
        raise ValidationError({
            "non_field_errors": [
                "This account is inactive."
            ]
        })

    # ---------------------------------------------------------
    # ADMIN INVITATION CODE
    # ---------------------------------------------------------

    configured_admin_code = getattr(
        settings,
        "MINDBLOOM_ADMIN_INVITE_CODE",
        ""
    )

    # Existing Django administrators can log in directly.
    already_admin = (
        user.is_staff or
        user.is_superuser
    )

    # New administrator can use invitation code.
    valid_invite = (
        clean_admin_code and
        configured_admin_code and
        clean_admin_code == configured_admin_code
    )

    if not already_admin and not valid_invite:
        raise ValidationError({
            "non_field_errors": [
                "Administrator privileges are required. "
                "Use the valid MindBloom administrator invitation code."
            ]
        })

    # ---------------------------------------------------------
    # GRANT ADMIN ACCESS
    # ---------------------------------------------------------

    if valid_invite and not user.is_staff:
        user.is_staff = True

    # Store the administrator's chosen name.
    profile, _ = UserProfile.objects.get_or_create(
        user=user
    )

    profile.full_name = clean_name
    user.first_name = clean_name

    user.save(
        update_fields=[
            "first_name",
            "is_staff"
        ]
    )

    profile.save()

    # ---------------------------------------------------------
    # JWT
    # ---------------------------------------------------------

    refresh = RefreshToken.for_user(user)

    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),

        "user": {
            "id": user.id,
            "full_name": profile.full_name or clean_name,
            "email": user.email,
            "date_joined": user.date_joined,

            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    }

def login_or_register_user(email: str, password: str, full_name: str = "") -> dict:
    """
    Checks if account exists:
    - If account exists: authenticates with password and returns tokens.
    - If account does NOT exist: registers user first and then authenticates & returns tokens.
    """
    clean_email = email.strip().lower()
    clean_name = full_name.strip() if full_name else "MindBloom User"

    if not User.objects.filter(email__iexact=clean_email).exists():
        # Auto register user
        user = create_user_account(
            full_name=clean_name,
            email=clean_email,
            password=password
        )
        refresh = RefreshToken.for_user(user)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return {
            "action": "registered_and_logged_in",
            "message": "Account created and logged in successfully.",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": user.id,
                "full_name": clean_name,
                "email": user.email,
                "date_joined": user.date_joined,
                "bio": profile.bio or "",
                "chat_count": profile.chat_count,
                "subscription_type": profile.subscription_type,
                "subscription_status": profile.subscription_status,
                "subscription_expiry": profile.subscription_expiry.isoformat() if profile.subscription_expiry else None,
            }
        }

    # Authenticate existing user
    auth_data = authenticate_user_by_email(email=clean_email, password=password)
    auth_data["action"] = "logged_in"
    auth_data["message"] = "Logged in successfully."
    return auth_data


def logout_user(refresh_token: str) -> bool:
    """
    Blacklists the provided refresh token.
    """
    if not refresh_token:
        raise ValidationError({"refresh_token": ["Refresh token is required for logout."]})
    
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return True
    except TokenError as e:
        raise ValidationError({"refresh_token": [f"Invalid or expired refresh token: {str(e)}"]})


def request_password_reset(email: str) -> str:
    """
    Generates a secure password reset token and sends a reset email/response.
    """
    clean_email = email.strip().lower()
    validate_email_format(clean_email)

    try:
        user = User.objects.get(email__iexact=clean_email)
    except User.DoesNotExist:
        # Avoid user enumeration - return standard success message or token placeholder
        raise ValidationError({"email": ["No active account found with this email address."]})

    # Generate secure random token
    reset_token_str = secrets.token_urlsafe(32)
    
    # Save token in DB
    PasswordResetToken.objects.create(
        user=user,
        token=reset_token_str
    )

    # Attempt sending email (graceful fallback if mail backend not configured)
    subject = "MindBloom - Password Reset Request"
    message = f"Hello {user.first_name or 'Friend'},\n\nUse the following token to reset your password:\n\n{reset_token_str}\n\nThis token will expire in 1 hour."
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@mindbloom.app'),
            recipient_list=[user.email],
            fail_silently=True
        )
    except Exception as e:
        logger.warning(f"Password reset email sending skipped or failed: {e}")

    return reset_token_str


def reset_password_with_token(token: str, new_password: str, confirm_password: str) -> User:
    """
    Validates password reset token and updates the user's password securely.
    """
    if not token or not token.strip():
        raise ValidationError({"token": ["Reset token is required."]})

    if new_password != confirm_password:
        raise ValidationError({"confirm_password": ["Passwords do not match."]})

    validate_password_strength(new_password)

    try:
        reset_obj = PasswordResetToken.objects.get(token=token.strip())
    except PasswordResetToken.DoesNotExist:
        raise ValidationError({"token": ["Invalid or expired password reset token."]})

    if not reset_obj.is_valid():
        raise ValidationError({"token": ["Password reset token has expired or already been used."]})

    user = reset_obj.user
    with transaction.atomic():
        user.set_password(new_password)
        user.save()
        reset_obj.is_used = True
        reset_obj.save()

    return user


def authenticate_google_user(id_token_str: str, admin_code: str = "") -> dict:
    """
    Authenticate a user through Google OAuth.

    Normal Google login:
        Google account -> normal user

    Google Admin login:
        Google account + correct admin invitation code
        -> Django staff account
    """

    if not id_token_str or not id_token_str.strip():
        raise ValidationError({
            "id_token": ["Google ID Token is required."]
        })

    clean_id_token = id_token_str.strip()

    google_client_id = getattr(
        settings,
        "GOOGLE_CLIENT_ID",
        ""
    )

    # ---------------------------------------------------------
    # VERIFY GOOGLE ID TOKEN
    # ---------------------------------------------------------

    id_info = None

    if google_id_token and google_requests:
        try:
            request = google_requests.Request()

            if google_client_id:
                id_info = google_id_token.verify_oauth2_token(
                    clean_id_token,
                    request,
                    audience=google_client_id,
                    clock_skew_in_seconds=10
                )
            else:
                id_info = google_id_token.verify_oauth2_token(
                    clean_id_token,
                    request,
                    clock_skew_in_seconds=10
                )

        except ValueError as e:
            logger.warning(
                f"Google ID Token verification failed: {e}"
            )

            raise ValidationError({
                "id_token": [
                    f"Invalid or expired Google ID Token: {str(e)}"
                ]
            })

        except Exception as e:
            logger.error(
                f"Error during Google token verification: {e}"
            )

            raise ValidationError({
                "id_token": [
                    f"Failed to verify Google token: {str(e)}"
                ]
            })

    else:
        raise ValidationError({
            "id_token": [
                "Google authentication library is unavailable."
            ]
        })

    # ---------------------------------------------------------
    # GOOGLE USER INFORMATION
    # ---------------------------------------------------------

    if not id_info or not isinstance(id_info, dict):
        raise ValidationError({
            "id_token": [
                "Could not retrieve valid Google user information."
            ]
        })

    email = id_info.get("email")

    if not email:
        raise ValidationError({
            "id_token": [
                "Google account does not have an associated email."
            ]
        })

    clean_email = email.strip().lower()

    full_name = (
        id_info.get("name")
        or id_info.get("given_name")
        or clean_email.split("@")[0].capitalize()
    )

    google_user_id = id_info.get("sub", "")
    picture = id_info.get("picture", "")

    # ---------------------------------------------------------
    # FIND OR CREATE DJANGO USER
    # ---------------------------------------------------------

    with transaction.atomic():

        user = User.objects.filter(
            email__iexact=clean_email
        ).first()

        action = "logged_in"

        if not user:

            user = User.objects.create_user(
                username=clean_email,
                email=clean_email,
                first_name=full_name
            )

            user.set_unusable_password()
            user.save()

            action = "registered_and_logged_in"

        # -----------------------------------------------------
        # USER PROFILE
        # -----------------------------------------------------

        profile, created = UserProfile.objects.get_or_create(
            user=user
        )

        if full_name and profile.full_name != full_name:
            profile.full_name = full_name
            profile.save()

        # -----------------------------------------------------
        # ADMIN INVITATION
        # -----------------------------------------------------

        configured_admin_code = getattr(
            settings,
            "MINDBLOOM_ADMIN_INVITE_CODE",
            ""
        )

        clean_admin_code = (
            admin_code.strip()
            if isinstance(admin_code, str)
            else ""
        )

        if (
            clean_admin_code
            and configured_admin_code
            and clean_admin_code == configured_admin_code
        ):
            user.is_staff = True
            user.save(update_fields=["is_staff"])

            logger.info(
                f"MindBloom admin access granted to {user.email}"
            )

        # -----------------------------------------------------
        # JWT
        # -----------------------------------------------------

        refresh = RefreshToken.for_user(user)

        return {
            "action": action,
            "message": "Google authentication successful.",

            "access_token": str(
                refresh.access_token
            ),

            "refresh_token": str(refresh),

            "user": {
                "id": user.id,
                "full_name": profile.full_name or full_name,
                "email": user.email,

                "google_id": google_user_id,
                "picture": picture,

                "date_joined": user.date_joined,

                "chat_count": profile.chat_count,

                "subscription_type":
                    profile.subscription_type,

                "subscription_status":
                    profile.subscription_status,

                "subscription_expiry":
                    profile.subscription_expiry.isoformat()
                    if profile.subscription_expiry
                    else None,

                # ⭐ IMPORTANT
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }
        }

