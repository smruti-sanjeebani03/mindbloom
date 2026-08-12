from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GratitudeViewSet, SelfTalkViewSet

router = DefaultRouter()
router.register(r'gratitude', GratitudeViewSet, basename='gratitude')
router.register(r'self-talk', SelfTalkViewSet, basename='self-talk')

urlpatterns = [
    path('', include(router.urls)),
]
