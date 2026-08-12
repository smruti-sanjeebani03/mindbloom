from rest_framework import serializers
from .models import Quote, Affirmation, Article, Newsletter, Testimonial


class QuoteSerializer(serializers.ModelSerializer):
    """
    Serializer for Quote model.
    Validates content and author.
    """
    text = serializers.CharField(source='content', read_only=True)
    quote = serializers.CharField(source='content', read_only=True)

    class Meta:
        model = Quote
        fields = ['id', 'content', 'text', 'quote', 'author', 'category', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Quote content cannot be empty or blank.")
        return value.strip()

    def validate_author(self, value):
        if value is not None and value.strip() == "":
            return "Anonymous"
        return value.strip() if value else "Anonymous"


class AffirmationSerializer(serializers.ModelSerializer):
    """
    Serializer for Affirmation model.
    Validates content.
    """
    text = serializers.CharField(source='content', read_only=True)
    affirmation = serializers.CharField(source='content', read_only=True)

    class Meta:
        model = Affirmation
        fields = ['id', 'content', 'text', 'affirmation', 'author', 'category', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Affirmation content cannot be empty or blank.")
        return value.strip()


class ArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model.
    Validates title, summary, content, category, and image URL.
    """

    description = serializers.CharField(
        source='summary',
        read_only=True
    )

    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'summary',
            'description',
            'content',
            'category',
            'source_url',
            'image',
            'published_date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at'
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Article title cannot be empty or blank."
            )
        return value.strip()

    def validate_summary(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Article summary cannot be empty or blank."
            )
        return value.strip()

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Article content cannot be empty or blank."
            )
        return value.strip()

    def validate_category(self, value):
        if not value or not value.strip():
            return "Self Care"
        return value.strip()

    def validate_source_url(self, value):
        if value:
            return value.strip()
        return value


class NewsletterSerializer(serializers.ModelSerializer):
    """
    Serializer for Newsletter model.
    Validates title and content.
    """
    class Meta:
        model = Newsletter
        fields = ['id', 'title', 'content', 'published_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Newsletter title cannot be empty or blank.")
        return value.strip()

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Newsletter content cannot be empty or blank.")
        return value.strip()


class TestimonialSerializer(serializers.ModelSerializer):
    """
    Serializer for Testimonial model.
    Validates name, role, rating, quote, and avatar.
    """
    class Meta:
        model = Testimonial
        fields = ['id', 'user', 'name', 'role', 'rating', 'quote', 'avatar', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_quote(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Review quote content cannot be empty or blank.")
        return value.strip()

    def validate_rating(self, value):
        if value is None:
            return 5
        try:
            val = int(value)
            if val < 1 or val > 5:
                raise serializers.ValidationError("Rating must be between 1 and 5.")
            return val
        except (ValueError, TypeError):
            raise serializers.ValidationError("Rating must be a valid integer.")

    def validate_name(self, value):
        if value is None or not str(value).strip():
            return "Anonymous Reviewer"
        return str(value).strip()

    def validate_role(self, value):
        if value is None or not str(value).strip():
            return "MindBloom User"
        return str(value).strip()

