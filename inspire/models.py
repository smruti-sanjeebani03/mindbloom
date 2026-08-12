from django.db import models
from django.utils import timezone
from django.conf import settings


class Quote(models.Model):
    content = models.TextField(help_text="The text of the inspirational quote")
    author = models.CharField(max_length=255, blank=True, null=True, default="Anonymous", help_text="Author of the quote")
    category = models.CharField(max_length=100, default="Mindfulness", help_text="Category or theme")
    is_active = models.BooleanField(default=True, help_text="Whether this quote is active for daily selection")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quotes"
        ordering = ['-created_at']
        verbose_name = "Quote"
        verbose_name_plural = "Quotes"

    def __str__(self):
        return f'"{self.content[:50]}..." - {self.author or "Anonymous"}'


class Affirmation(models.Model):
    content = models.TextField(help_text="The text of the gentle affirmation")
    author = models.CharField(max_length=255, blank=True, null=True, default="MindBloom", help_text="Author or source")
    category = models.CharField(max_length=100, default="General", help_text="Category or theme")
    is_active = models.BooleanField(default=True, help_text="Whether this affirmation is active for daily selection")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "affirmations"
        ordering = ['-created_at']
        verbose_name = "Affirmation"
        verbose_name_plural = "Affirmations"

    def __str__(self):
        return f'"{self.content[:60]}..."'


class Article(models.Model):
    title = models.CharField(max_length=255, help_text="Title of the wellness article")
    summary = models.TextField(help_text="Short summary or teaser of the article")
    content = models.TextField(help_text="Full body content of the article")
    category = models.CharField(
        max_length=100,
        default="Self Care"
    )

    source_url = models.URLField(
    max_length=1000,
    blank=True,
    null=True
)

    image = models.URLField(max_length=1024, blank=True, null=True, help_text="Optional header image URL")
    published_date = models.DateTimeField(default=timezone.now, help_text="Publication date and time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']
        verbose_name = "Article"
        verbose_name_plural = "Articles"

    def __str__(self):
        return self.title


class Newsletter(models.Model):
    title = models.CharField(max_length=255, help_text="Title of the newsletter")
    content = models.TextField(help_text="Body content of the newsletter")
    published_date = models.DateTimeField(default=timezone.now, help_text="Publication date and time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']
        verbose_name = "Newsletter"
        verbose_name_plural = "Newsletters"

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="testimonials")
    name = models.CharField(max_length=255, default="Anonymous Reviewer", help_text="Author name")
    role = models.CharField(max_length=255, default="MindBloom User", help_text="Role or title")
    rating = models.IntegerField(default=5, help_text="Rating from 1 to 5")
    quote = models.TextField(help_text="Testimonial or review text")
    avatar = models.CharField(max_length=512, blank=True, null=True, default="", help_text="Avatar image URL")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "testimonials"
        ordering = ['-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.name} ({self.rating} stars): {self.quote[:30]}"

