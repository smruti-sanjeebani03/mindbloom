from django.contrib import admin
from .models import Mood


@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'mood', 'short_note', 'created_at', 'updated_at')
    list_filter = ('mood', 'created_at', 'updated_at')
    search_fields = ('user__email', 'user__username', 'mood', 'note')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    @admin.display(description='User Email', ordering='user__email')
    def get_user_email(self, obj):
        return obj.user.email or obj.user.username

    @admin.display(description='Note Preview')
    def short_note(self, obj):
        if not obj.note:
            return "-"
        return obj.note[:40] + ("..." if len(obj.note) > 40 else "")
