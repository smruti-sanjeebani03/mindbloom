from rest_framework import serializers
from .models import Gratitude, SelfTalk

class GratitudeSerializer(serializers.ModelSerializer):
    """
    Serializer for Gratitude model.
    Read-only fields for user identification and system metadata.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Gratitude
        fields = [
            'id',
            'user',
            'user_email',
            'gratitude',
            'reflection_date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'created_at', 'updated_at']

    def validate_gratitude(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Gratitude content cannot be empty.")
        return value.strip()


class SelfTalkSerializer(serializers.ModelSerializer):
    """
    Serializer for SelfTalk model.
    Read-only fields for user identification and system metadata.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = SelfTalk
        fields = [
            'id',
            'user',
            'user_email',
            'self_talk',
            'reflection_date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'created_at', 'updated_at']

    def validate_self_talk(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Self-talk content cannot be empty.")
        return value.strip()