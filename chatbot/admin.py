from django.contrib import admin
from .models import BloomBotFeedback


@admin.register(BloomBotFeedback)
class BloomBotFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'feedback_type', 'short_prompt', 'short_comment', 'created_at')
    list_filter = ('feedback_type', 'created_at')
    search_fields = ('user__email', 'user__username', 'user_prompt', 'ai_response', 'optional_comment')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    @admin.display(description='User Email', ordering='user__email')
    def get_user_email(self, obj):
        if not obj.user:
            return "Anonymous"
        return obj.user.email or obj.user.username

    @admin.display(description='Prompt')
    def short_prompt(self, obj):
        if not obj.user_prompt:
            return "-"
        return obj.user_prompt[:35] + ("..." if len(obj.user_prompt) > 35 else "")

    @admin.display(description='Comment')
    def short_comment(self, obj):
        if not obj.optional_comment:
            return "-"
        return obj.optional_comment[:30] + ("..." if len(obj.optional_comment) > 30 else "")
