from django.db import models
from django.conf import settings

class Gratitude(models.Model):
    """
    Model representing a user's gratitude entry.
    Each user can store text reflecting what they are grateful for.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='gratitude_entries',
        help_text="The user who created this gratitude entry."
    )
    gratitude = models.TextField(
        help_text="The text of the gratitude entry."
    )
    reflection_date = models.DateField(
        help_text="The calendar date this reflection belongs to."
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
        verbose_name = 'Gratitude'
        verbose_name_plural = 'Gratitudes'

    def __str__(self):
        return f"Gratitude by {self.user.email} on {self.reflection_date}"


class SelfTalk(models.Model):
    """
    Model representing a user's compassionate self-talk entry.
    Each user can store text reflecting positive/compassionate self-talk statements.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='selftalk_entries',
        help_text="The user who created this self-talk entry."
    )
    self_talk = models.TextField(
        help_text="The text of the self-talk entry."
    )
    reflection_date = models.DateField(
        help_text="The calendar date this reflection belongs to."
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
        verbose_name = 'Self-Talk'
        verbose_name_plural = 'Self-Talks'

    def __str__(self):
        return f"SelfTalk by {self.user.email} on {self.reflection_date}"