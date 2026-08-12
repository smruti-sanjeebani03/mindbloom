from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class MoodChoice(models.TextChoices):
    HAPPY = 'Happy', 'Happy 😊'
    CALM = 'Calm', 'Calm 😌'
    EXCITED = 'Excited', 'Excited 🤩'
    GRATEFUL = 'Grateful', 'Grateful 🌸'
    NEUTRAL = 'Neutral', 'Neutral 😐'
    TIRED = 'Tired', 'Tired 😴'
    STRESSED = 'Stressed', 'Stressed 😖'
    ANXIOUS = 'Anxious', 'Anxious 😰'
    SAD = 'Sad', 'Sad 😔'
    ANGRY = 'Angry', 'Angry 😠'


class Mood(models.Model):
    """
    Mood model representing a logged user emotion, score (1-10), and optional reflection note.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mood_entries',
        help_text="The authenticated user recording their mood."
    )
    mood = models.CharField(
        max_length=50,
        choices=MoodChoice.choices,
        help_text="The selected emotion state (e.g., Happy, Calm, Sad)."
    )
    score = models.PositiveSmallIntegerField(
        default=5,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10),
        ],
        help_text="Overall mood score rating from 1 to 10."
    )
    note = models.TextField(
        blank=True,
        null=True,
        help_text="Optional note or context explaining the mood."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the mood entry was recorded."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the mood entry was last modified."
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mood Entry'
        verbose_name_plural = 'Mood Entries'

    def __str__(self):
        return f"{self.user.email or self.user.username} - {self.mood} ({self.score}/10) at {self.created_at.strftime('%Y-%m-%d %H:%M')}"