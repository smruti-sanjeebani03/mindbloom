from django.contrib import admin
from .models import Story


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'author_display', 'is_anonymous', 'is_reported', 'created_at')
    list_filter = ('category', 'is_anonymous', 'is_reported', 'created_at')
    search_fields = ('title', 'content', 'category', 'user__username', 'user__email')

    def author_display(self, obj):
        if obj.is_anonymous or not obj.user:
            return "Anonymous"
        return obj.user.first_name or obj.user.username
    author_display.short_description = 'Author'
