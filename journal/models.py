from django.db import models
from django.contrib.auth.models import User


class Journal(models.Model):
    """
    Journal model representing a personal journal entry associated with an authenticated User.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='journal_entries',
        help_text="The authenticated user who owns this journal entry."
    )
    title = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        help_text="Title of the journal entry."
    )
    content = models.TextField(
        blank=False,
        null=False,
        help_text="Content or reflection body of the journal entry."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the entry was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the entry was last updated."
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Journal Entry'
        verbose_name_plural = 'Journal Entries'

    def __str__(self):
        return f"{self.title} ({self.user.email or self.user.username})"
