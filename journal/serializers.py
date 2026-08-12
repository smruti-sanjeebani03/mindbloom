from rest_framework import serializers
from .models import Journal


class JournalSerializer(serializers.ModelSerializer):
    """
    Serializer for creating, retrieving, and updating Journal entries.
    Automatically binds the authenticated user upon creation.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Journal
        fields = [
            'id',
            'user',
            'user_email',
            'title',
            'content',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty or blank.")
        return value.strip()

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty or blank.")
        return value.strip()
