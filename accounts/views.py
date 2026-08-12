import os
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import UserProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    LogoutSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    UserProfileSerializer,
    GoogleOAuthSerializer,
)
from .services import (
    authenticate_user_by_email,
    authenticate_admin_user,
    login_or_register_user,
    logout_user,
    request_password_reset,
    reset_password_with_token,
    authenticate_google_user,
)


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Secure User Registration API endpoint.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "User registered successfully.",
                    "data": {
                        "id": user.id,
                        "full_name": user.first_name,
                        "email": user.email,
                        "date_joined": user.date_joined,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                "status": "error",
                "message": "Registration failed due to invalid data.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    User Login API endpoint returning JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Login failed due to invalid input.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            auth_data = authenticate_user_by_email(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            return Response(
                {
                    "status": "success",
                    "message": "Login successful.",
                    "data": auth_data
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            detail = e.detail
            requires_reg = False
            if isinstance(detail, dict) and detail.get("requires_registration"):
                requires_reg = True

            return Response(
                {
                    "status": "error",
                    "requires_registration": requires_reg,
                    "message": "No account found for this email address. Please register an account first." if requires_reg else "Authentication failed.",
                    "errors": detail
                },
                status=status.HTTP_404_NOT_FOUND if requires_reg else status.HTTP_401_UNAUTHORIZED
            )

class AdminLoginView(APIView):
    """
    POST /api/auth/admin-login/

    Secure MindBloom administrator login.

    Existing staff/superuser:
        name + email + password

    New administrator:
        name + email + password + admin invitation code
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        name = request.data.get("name", "")
        email = request.data.get("email", "")
        password = request.data.get("password", "")
        admin_code = request.data.get("admin_code", "")

        try:

            auth_data = authenticate_admin_user(
                name=name,
                email=email,
                password=password,
                admin_code=admin_code
            )

            return Response(
                {
                    "status": "success",
                    "message": "Administrator authenticated successfully.",
                    "data": auth_data
                },
                status=status.HTTP_200_OK
            )

        except ValidationError as e:

            return Response(
                {
                    "status": "error",
                    "message": "Admin authentication failed.",
                    "errors": e.detail
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


class LoginOrRegisterView(APIView):
    """
    POST /api/auth/login-or-register/
    Smart authentication endpoint that automatically registers new users if no account exists, or logs in existing users.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Authentication failed due to invalid input.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            full_name = request.data.get("full_name", "")
            auth_data = login_or_register_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                full_name=full_name
            )
            return Response(
                {
                    "status": "success",
                    "message": auth_data.get("message", "Authentication successful."),
                    "data": auth_data
                },
                status=status.HTTP_201_CREATED if auth_data.get("action") == "registered_and_logged_in" else status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                {
                    "status": "error",
                    "message": "Process failed due to validation errors.",
                    "errors": e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )



class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklist JWT refresh token to securely log out user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Logout failed due to invalid input.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            logout_user(serializer.validated_data['refresh_token'])
            return Response(
                {
                    "status": "success",
                    "message": "Successfully logged out."
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                {
                    "status": "error",
                    "message": "Logout failed.",
                    "errors": e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class ForgotPasswordView(APIView):
    """
    POST /api/auth/forgot-password/
    Generates a secure password reset token and sends email.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Request failed due to invalid input.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_token = request_password_reset(serializer.validated_data['email'])
            return Response(
                {
                    "status": "success",
                    "message": "Password reset instructions have been sent to your email address.",
                    "reset_token": reset_token  # Provided for API testing / client use
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                {
                    "status": "error",
                    "message": "Unable to process password reset request.",
                    "errors": e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class ResetPasswordView(APIView):
    """
    POST /api/auth/reset-password/
    Validates reset token and sets new user password.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Password reset failed due to invalid input.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_password_with_token(
                token=serializer.validated_data['token'],
                new_password=serializer.validated_data['password'],
                confirm_password=serializer.validated_data['confirm_password']
            )
            return Response(
                {
                    "status": "success",
                    "message": "Password has been successfully reset. You can now log in with your new password."
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                {
                    "status": "error",
                    "message": "Password reset failed.",
                    "errors": e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(APIView):
    """
    GET   /api/auth/profile/
    PATCH /api/auth/profile/

    Returns and updates authenticated user profile details.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(
            request.user
        )

        return Response(
            {
                "status": "success",
                "message": "User profile fetched successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request, *args, **kwargs):
        user = request.user

        # Make sure the extended profile exists.
        profile, _ = UserProfile.objects.get_or_create(
            user=user
        )

        # ---------------------------------------------
        # FULL NAME
        # ---------------------------------------------
        full_name = request.data.get(
            "full_name"
        )

        if full_name is not None:
            full_name = str(
                full_name
            ).strip()

            if not full_name:
                return Response(
                    {
                        "status": "error",
                        "message": "Full name cannot be empty.",
                        "errors": {
                            "full_name": [
                                "Full name cannot be empty."
                            ]
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            profile.full_name = full_name

            # Keep Django's User name synchronized.
            user.first_name = full_name

        # ---------------------------------------------
        # BIO
        # ---------------------------------------------
        bio = request.data.get(
            "bio"
        )

        if bio is not None:
            profile.bio = str(
                bio
            ).strip()

        # ---------------------------------------------
        # SAVE
        # ---------------------------------------------
        profile.save()

        if full_name is not None:
            user.save(
                update_fields=[
                    "first_name"
                ]
            )

        # ---------------------------------------------
        # RETURN UPDATED PROFILE
        # ---------------------------------------------
        serializer = UserProfileSerializer(
            user
        )

        return Response(
            {
                "status": "success",
                "message": "Profile updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class GoogleOAuthView(APIView):
    """
    POST /api/auth/google/

    Google OAuth Authentication endpoint.

    Normal:
        Google login

    Admin:
        Google login + admin invitation code
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        serializer = GoogleOAuthSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "status": "error",
                    "message": (
                        "Authentication failed due to "
                        "invalid or missing Google ID token."
                    ),
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            admin_code = request.data.get(
                "admin_code",
                ""
            )

            auth_data = authenticate_google_user(
                serializer.validated_data["id_token"],
                admin_code=admin_code
            )

            return Response(
                {
                    "status": "success",
                    "message": auth_data.get(
                        "message",
                        "Google OAuth authentication successful."
                    ),
                    "data": auth_data
                },
                status=(
                    status.HTTP_200_OK
                    if auth_data.get("action") == "logged_in"
                    else status.HTTP_201_CREATED
                )
            )

        except ValidationError as e:

            return Response(
                {
                    "status": "error",
                    "message": (
                        "Google authentication "
                        "token verification failed."
                    ),
                    "errors": e.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )

def get_user_from_request(request):
    if request.user and request.user.is_authenticated:
        return request.user
    email = request.headers.get('x-user-email') or request.META.get('HTTP_X_USER_EMAIL')
    if email:
        return User.objects.filter(email__iexact=email.strip()).first()
    return None


class UserSubscriptionView(APIView):
    """
    GET /api/user/subscription/
    Returns subscription and usage tracking status for the user.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = get_user_from_request(request)
        if not user:
            return Response(
                {
                    "success": True,
                    "message": "Default free subscription for guest.",
                    "data": {
                        "chat_count": 0,
                        "subscription_type": "free",
                        "subscription_status": "inactive",
                        "subscription_expiry": None,
                        "chats_remaining": 100
                    }
                },
                status=status.HTTP_200_OK
            )
        profile, _ = UserProfile.objects.get_or_create(user=user)
        is_premium = profile.is_premium()
        return Response(
            {
                "success": True,
                "message": "Subscription status retrieved.",
                "data": {
                    "chat_count": profile.chat_count,
                    "subscription_type": profile.subscription_type,
                    "subscription_status": profile.subscription_status,
                    "subscription_expiry": profile.subscription_expiry.isoformat() if profile.subscription_expiry else None,
                    "chats_remaining": "Unlimited" if is_premium else max(0, 100 - profile.chat_count)
                }
            },
            status=status.HTTP_200_OK
        )


class CreatePaymentOrderView(APIView):
    """
    POST /api/payment/create-order/
    Generates a secure Razorpay payment order for MindBloom Premium upgrade.
    Requires server-side Razorpay credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET).
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        razorpay_key_id = getattr(settings, 'RAZORPAY_KEY_ID', os.getenv('RAZORPAY_KEY_ID', ''))
        razorpay_key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', os.getenv('RAZORPAY_KEY_SECRET', ''))

        if not razorpay_key_id or not razorpay_key_secret:
            return Response(
                {
                    "success": False,
                    "message": "Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured in the server environment variables. Real payment orders cannot be created without valid Razorpay credentials."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_user_from_request(request)
        plan = request.data.get("plan", "monthly")
        amount_in_subunits = 99900 if plan == "monthly" else 999000  # Amount in paise (INR)

        try:
            import razorpay
            client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
            order_data = {
                "amount": amount_in_subunits,
                "currency": "INR",
                "receipt": f"receipt_mb_{user.id if user else 'guest'}_{int(timezone.now().timestamp())}",
                "notes": {
                    "user_id": str(user.id) if user else "guest",
                    "plan": plan
                }
            }
            order = client.order.create(data=order_data)
            return Response(
                {
                    "success": True,
                    "order_id": order["id"],
                    "key_id": razorpay_key_id,
                    "amount": order["amount"],
                    "currency": order["currency"],
                    "name": "MindBloom Premium Subscription",
                    "description": "Unlimited BloomBot conversations & emotional wellness support",
                    "user_email": user.email if user else request.data.get("email", "")
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"Failed to create Razorpay payment order: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyPaymentView(APIView):
    """
    POST /api/payment/verify/
    Verifies Razorpay payment signature server-side and updates user subscription to Premium.
    Never trusts unverified frontend subscription activation requests.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        razorpay_key_id = getattr(settings, 'RAZORPAY_KEY_ID', os.getenv('RAZORPAY_KEY_ID', ''))
        razorpay_key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', os.getenv('RAZORPAY_KEY_SECRET', ''))

        if not razorpay_key_id or not razorpay_key_secret:
            return Response(
                {
                    "success": False,
                    "message": "Razorpay credentials are not configured on the server. Signature verification cannot be performed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not razorpay_payment_id or not razorpay_order_id or not razorpay_signature:
            return Response(
                {
                    "success": False,
                    "message": "Payment verification failed: Missing required Razorpay parameters (razorpay_payment_id, razorpay_order_id, razorpay_signature)."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            import razorpay
            client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"Payment signature verification failed: Invalid Razorpay signature. ({str(e)})"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_user_from_request(request)
        if not user:
            email = request.data.get("email") or request.headers.get("x-user-email")
            if email:
                user = User.objects.filter(email__iexact=email.strip()).first()

        if not user:
            return Response(
                {
                    "success": False,
                    "message": "User account not found for subscription activation."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        expiry_date = timezone.now() + timedelta(days=30)
        profile.subscription_type = 'premium'
        profile.subscription_status = 'active'
        profile.subscription_expiry = expiry_date
        profile.save()

        return Response(
            {
                "success": True,
                "message": "MindBloom Premium activated successfully via verified Razorpay payment!",
                "data": {
                    "chat_count": profile.chat_count,
                    "subscription_type": profile.subscription_type,
                    "subscription_status": profile.subscription_status,
                    "subscription_expiry": profile.subscription_expiry.isoformat(),
                    "chats_remaining": "Unlimited"
                }
            },
            status=status.HTTP_200_OK
        )


