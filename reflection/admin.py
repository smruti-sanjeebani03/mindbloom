from django.contrib import admin
from .models import Gratitude, SelfTalk


@admin.register(Gratitude)
class GratitudeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'short_gratitude', 'created_at', 'updated_at')
    search_fields = ('user__email', 'user__username', 'gratitude')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def user_email(self, obj):
        return obj.user.email or obj.user.username
    user_email.short_description = 'User Email'

    def short_gratitude(self, obj):
        return obj.gratitude[:60] + "..." if len(obj.gratitude) > 60 else obj.gratitude
    short_gratitude.short_description = 'Gratitude Entry'


@admin.register(SelfTalk)
class SelfTalkAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'short_self_talk', 'created_at', 'updated_at')
    search_fields = ('user__email', 'user__username', 'self_talk')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def user_email(self, obj):
        return obj.user.email or obj.user.username
    user_email.short_description = 'User Email'

    def short_self_talk(self, obj):
        return obj.self_talk[:60] + "..." if len(obj.self_talk) > 60 else obj.self_talk
    short_self_talk.short_description = 'Self-Talk Entry'
