from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class UserProfile(models.Model):
    """
    Extended profile for MindBloom user metadata,
    usage tracking, personal information,
    and subscription details.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    full_name = models.CharField(
        max_length=255,
        blank=True
    )

    bio = models.TextField(
        blank=True,
        default=""
    )

    chat_count = models.IntegerField(
        default=0
    )

    subscription_type = models.CharField(
        max_length=50,
        default="free"
    )

    subscription_status = models.CharField(
        max_length=50,
        default="inactive"
    )

    subscription_expiry = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def is_premium(self) -> bool:
        return (
            self.subscription_status == "active"
            or self.subscription_type == "premium"
        )

    def __str__(self):
        return (
            f"Profile of {self.user.email} "
            f"(Chats: {self.chat_count}, "
            f"Sub: {self.subscription_type})"
        )


class PasswordResetToken(models.Model):
    """
    Model to store secure password reset tokens
    with 1-hour expiration.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens"
    )

    token = models.CharField(
        max_length=128,
        unique=True,
        db_index=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_used = models.BooleanField(
        default=False
    )

    def is_valid(self) -> bool:
        if self.is_used:
            return False

        return (
            timezone.now() - self.created_at
        ) < timedelta(hours=1)

    def __str__(self):
        return f"Reset token for {self.user.email}"