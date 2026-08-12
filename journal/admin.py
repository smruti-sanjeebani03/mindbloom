from django.contrib import admin
from .models import Journal


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'get_user_email', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__email', 'user__username', 'title', 'content')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    @admin.display(description='User Email', ordering='user__email')
    def get_user_email(self, obj):
        return obj.user.email or obj.user.username
