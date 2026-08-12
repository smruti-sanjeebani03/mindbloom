from django.contrib import admin
from .models import Quote, Affirmation, Article, Newsletter


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'short_content', 'author', 'created_at', 'updated_at')
    search_fields = ('content', 'author')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def short_content(self, obj):
        return obj.content[:60] + "..." if len(obj.content) > 60 else obj.content
    short_content.short_description = "Content"


@admin.register(Affirmation)
class AffirmationAdmin(admin.ModelAdmin):
    list_display = ('id', 'short_content', 'created_at', 'updated_at')
    search_fields = ('content',)
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def short_content(self, obj):
        return obj.content[:60] + "..." if len(obj.content) > 60 else obj.content
    short_content.short_description = "Content"


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'published_date', 'created_at', 'updated_at')
    search_fields = ('title', 'summary', 'content')
    list_filter = ('published_date', 'created_at')
    ordering = ('-published_date', '-created_at')
    date_hierarchy = 'published_date'


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'published_date', 'created_at', 'updated_at')
    search_fields = ('title', 'content')
    list_filter = ('published_date', 'created_at')
    ordering = ('-published_date', '-created_at')
    date_hierarchy = 'published_date'
