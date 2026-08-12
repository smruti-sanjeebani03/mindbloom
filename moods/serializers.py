from rest_framework import serializers
from .models import Mood, MoodChoice


class MoodSerializer(serializers.ModelSerializer):
    """
    Serializer for creating, retrieving, and updating Mood entries.
    Validates mood against permitted choices and connects user automatically.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Mood
        fields = [
            'id',
            'user',
            'user_email',
            'mood',
            'score',
            'note',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'created_at', 'updated_at']

    def validate_score(self, value):
        if value is None:
            return 5
        if not (1 <= value <= 10):
            raise serializers.ValidationError("Score must be between 1 and 10.")
        return value

    def validate_mood(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Mood is required.")
        
        clean_val = str(value).strip()
        
        # Check against basic string names or choices
        valid_choices = [c[0] for c in MoodChoice.choices] + [c[1] for c in MoodChoice.choices]
        
        # Flexibly match valid choices (e.g. "Happy" or "Happy 😊")
        matched = None
        for choice_val, choice_label in MoodChoice.choices:
            if clean_val.lower() == choice_val.lower() or clean_val.lower() in choice_label.lower():
                matched = choice_val
                break

        if not matched:
            raise serializers.ValidationError(
                f"Invalid mood value '{clean_val}'. Allowed choices: {', '.join([c[0] for c in MoodChoice.choices])}."
            )
        
        return matched