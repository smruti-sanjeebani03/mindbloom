from django.urls import path
from .views import (
    ChatbotAPIView,
    BloomBotFeedbackView,
    BloomBotRetryView,
    BloomBotAdminFeedbackView
)

urlpatterns = [
    path('chat/', ChatbotAPIView.as_view(), name='chat_api'),
    path('chat/feedback/', BloomBotFeedbackView.as_view(), name='chat_feedback'),
    path('chat/retry/', BloomBotRetryView.as_view(), name='chat_retry'),
    path('chat/regenerate/', BloomBotRetryView.as_view(), name='chat_regenerate'),
    path('admin/bloombot-feedback/', BloomBotAdminFeedbackView.as_view(), name='admin_bloombot_feedback'),
]
