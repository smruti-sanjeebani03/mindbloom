from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuoteViewSet,
    AffirmationViewSet,
    ArticleViewSet,
    NewsletterViewSet,
    TodayInspireView, 
    TestimonialListCreateView,
)

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'affirmations', AffirmationViewSet, basename='affirmation')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'newsletters', NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('today/', TodayInspireView.as_view(), name='inspire-today'),
    path('testimonials/', TestimonialListCreateView.as_view(), name='testimonials'),
    path('', include(router.urls)),
]
