from django.db import models
from django.contrib.auth.models import User


class Story(models.Model):
    """
    Story model representing a community story entry shared by a user or anonymously.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='stories',
        help_text="The user who created this story. Nullable for anonymous guest stories."
    )
    title = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        help_text="Title of the story."
    )
    category = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        help_text="Category of the story (e.g. Anxiety, Stress, Burnout, etc.)."
    )
    content = models.TextField(
        blank=False,
        null=False,
        help_text="Body content of the story."
    )
    is_anonymous = models.BooleanField(
        default=False,
        help_text="Whether the author requested to publish anonymously."
    )
    is_reported = models.BooleanField(
        default=False,
        help_text="Whether this story has been reported by a community member."
    )
    report_reason = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Reason provided if the story was reported."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the story was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the story was last updated."
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Story'
        verbose_name_plural = 'Stories'

    def __str__(self):
        author = "Anonymous" if self.is_anonymous or not self.user else (self.user.first_name or self.user.username)
        return f"{self.title} by {author}"
