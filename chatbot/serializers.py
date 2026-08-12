from rest_framework import serializers
from .models import BloomBotFeedback


class ChatMessageSerializer(serializers.Serializer):
    """
    Serializer for incoming chatbot user messages.
    Validates input message content to prevent empty or invalid requests.
    """
    message = serializers.CharField(
        required=True,
        allow_blank=False,
        max_length=2000,
        error_messages={
            'required': 'Message is required.',
            'blank': 'Message cannot be empty.',
            'max_length': 'Message cannot exceed 2000 characters.'
        }
    )
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
        help_text="Optional temporary conversation history sent from frontend for context without DB persistence."
    )

    def validate_message(self, value):
        cleaned_val = value.strip()
        if not cleaned_val:
            raise serializers.ValidationError("Message cannot consist only of whitespace.")
        return cleaned_val


class ChatResponseSerializer(serializers.Serializer):
    """
    Serializer for outgoing BloomBot response structure.
    """
    reply = serializers.CharField()


class BloomBotFeedbackSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and retrieving BloomBot feedback submissions.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = BloomBotFeedback
        fields = [
            'id',
            'user',
            'user_email',
            'user_prompt',
            'ai_response',
            'feedback_type',
            'selected_reasons',
            'optional_comment',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'created_at']

    def validate_feedback_type(self, value):
        if value not in ['Helpful', 'Not Helpful']:
            raise serializers.ValidationError("Feedback type must be either 'Helpful' or 'Not Helpful'.")
        return value


class BloomBotRetrySerializer(serializers.Serializer):
    """
    Serializer for regenerating a fresh BloomBot response using the same prompt context.
    """
    message = serializers.CharField(required=True, allow_blank=False)
    history = serializers.ListField(child=serializers.DictField(), required=False, default=list)
    previous_response = serializers.CharField(required=False, allow_blank=True, default='')
