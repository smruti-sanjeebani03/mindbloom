from rest_framework import serializers
from .models import Story

VALID_CATEGORIES = [
    "Anxiety",
    "Stress",
    "Burnout",
    "Self Confidence",
    "Depression Recovery",
    "College Life",
    "Career",
    "Personal Growth",
    "Relationships",
    "Other"
]


class StorySerializer(serializers.ModelSerializer):
    """
    Serializer for creating, retrieving, and updating Story entries.
    Handles author name computation based on anonymity settings.
    """
    user_email = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id',
            'user',
            'user_email',
            'author_name',
            'title',
            'category',
            'content',
            'is_anonymous',
            'is_reported',
            'report_reason',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'author_name', 'is_reported', 'report_reason', 'created_at', 'updated_at']

    def get_user_email(self, obj):
        if obj.is_anonymous or not obj.user:
            return "anonymous@mindbloom.app"
        return obj.user.email or f"{obj.user.username}@mindbloom.app"

    def get_author_name(self, obj):
        if obj.is_anonymous or not obj.user:
            return "Anonymous"
        if obj.user.first_name and obj.user.first_name.strip():
            return obj.user.first_name.strip()
        # Fallback to username
        username = obj.user.username
        if "@" in username:
            username = username.split("@")[0]
        return username.replace(".", " ").title()

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required and cannot be empty.")
        return value.strip()

    def validate_category(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Category is required.")
        val_trimmed = value.strip()
        # Case insensitive match or fallback
        matched = next((c for c in VALID_CATEGORIES if c.lower() == val_trimmed.lower()), val_trimmed)
        return matched

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Story content is required and cannot be empty.")
        return value.strip()


class StoryReportSerializer(serializers.Serializer):
    """
    Serializer for reporting a story.
    """
    reason = serializers.CharField(required=True)
    details = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_reason(self, value):
        valid_reasons = ["Abuse", "Hate Speech", "Harassment", "Spam", "Misinformation", "Other"]
        if not value or value.strip() not in valid_reasons:
            raise serializers.ValidationError(f"Please select a valid reason. Must be one of: {', '.join(valid_reasons)}")
        return value.strip()
