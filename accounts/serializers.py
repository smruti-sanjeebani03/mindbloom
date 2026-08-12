from rest_framework import serializers
from django.contrib.auth.models import User

from .validators import (
    validate_password_strength,
    validate_email_format,
)

from .services import create_user_account


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(
        max_length=255,
        required=True,
        error_messages={
            "required": "Full name is required."
        }
    )

    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email address is required."
        }
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "required": "Password is required."
        }
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "required": "Password confirmation is required."
        }
    )

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Full name cannot be empty or blank."
            )

        return value.strip()

    def validate_email(self, value):
        clean_email = value.strip().lower()

        validate_email_format(clean_email)

        if (
            User.objects.filter(
                email__iexact=clean_email
            ).exists()
            or
            User.objects.filter(
                username__iexact=clean_email
            ).exists()
        ):
            raise serializers.ValidationError(
                "An account with this email address already exists."
            )

        return clean_email

    def validate_password(self, value):
        validate_password_strength(value)
        return value

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get(
            "confirm_password"
        )

        if password != confirm_password:
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        "Passwords do not match."
                    ]
                }
            )

        return attrs

    def create(self, validated_data):
        return create_user_account(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email address is required."
        }
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "required": "Password is required."
        }
    )


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(
        required=True,
        error_messages={
            "required": "Refresh token is required."
        }
    )


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email address is required."
        }
    )


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(
        required=True,
        error_messages={
            "required": "Password reset token is required."
        }
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "required": "New password is required."
        }
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        error_messages={
            "required": "Password confirmation is required."
        }
    )


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    chat_count = serializers.SerializerMethodField()
    subscription_type = serializers.SerializerMethodField()
    subscription_status = serializers.SerializerMethodField()
    subscription_expiry = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "full_name",
            "email",
            "date_joined",
            "bio",
            "chat_count",
            "subscription_type",
            "subscription_status",
            "subscription_expiry",
        ]

        read_only_fields = [
            "id",
            "email",
            "date_joined",
        ]

    def get_full_name(self, obj):
        if (
            hasattr(obj, "profile")
            and obj.profile.full_name
        ):
            return obj.profile.full_name

        return obj.first_name or obj.username

    def get_bio(self, obj):
        if (
            hasattr(obj, "profile")
            and obj.profile.bio
        ):
            return obj.profile.bio

        return ""

    def get_chat_count(self, obj):
        if hasattr(obj, "profile"):
            return obj.profile.chat_count

        return 0

    def get_subscription_type(self, obj):
        if hasattr(obj, "profile"):
            return obj.profile.subscription_type

        return "free"

    def get_subscription_status(self, obj):
        if hasattr(obj, "profile"):
            return obj.profile.subscription_status

        return "inactive"

    def get_subscription_expiry(self, obj):
        if (
            hasattr(obj, "profile")
            and obj.profile.subscription_expiry
        ):
            return obj.profile.subscription_expiry.isoformat()

        return None


class GoogleOAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(
        required=True,
        error_messages={
            "required": "Google ID Token is required."
        }
    )