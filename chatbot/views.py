from collections import Counter
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

from .models import BloomBotFeedback, FeedbackType
from .serializers import (
    ChatMessageSerializer,
    ChatResponseSerializer,
    BloomBotFeedbackSerializer,
    BloomBotRetrySerializer
)
from .services import GeminiChatbotService

logger = logging.getLogger(__name__)


class ChatbotAPIView(APIView):
    """
    API View for BloomBot Chatbot endpoint.
    Accepts: POST /api/chat/ { "message": "I feel anxious today." }
    Returns: { "reply": "I'm sorry you're feeling anxious today...", "chat_count": 5, "subscription_type": "free", "subscription_status": "inactive", "chats_remaining": 95 }
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = ChatMessageSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid chatbot request payload: {serializer.errors}")
            return Response(
                {
                    "error": "Validation Error",
                    "details": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user if request.user and request.user.is_authenticated else None
        profile = getattr(user, 'profile', None) if user else None

        if profile:
            is_premium = profile.subscription_status == 'active' or profile.subscription_type == 'premium'
            if not is_premium and profile.chat_count >= 100:
                return Response(
                    {
                        "limit_reached": True,
                        "error": "LIMIT_REACHED",
                        "message": "🌸 You've reached your free chat limit.",
                        "reply": "🌸 You've reached your free chat limit. You've enjoyed 100 free conversations with BloomBot. Upgrade to MindBloom Premium to continue unlimited AI conversations and receive ongoing emotional support.",
                        "chat_count": profile.chat_count,
                        "subscription_type": profile.subscription_type,
                        "subscription_status": profile.subscription_status
                    },
                    status=status.HTTP_200_OK
                )

        validated_data = serializer.validated_data
        user_message = validated_data['message']
        conversation_history = validated_data.get('history', [])

        try:
            service = GeminiChatbotService()
            reply_text = service.generate_reply(
                message=user_message,
                history=conversation_history
            )

            if profile:
                profile.chat_count += 1
                profile.save()
                chat_count = profile.chat_count
                sub_type = profile.subscription_type
                sub_status = profile.subscription_status
                is_premium = sub_status == 'active' or sub_type == 'premium'
                chats_remaining = "Unlimited" if is_premium else max(0, 100 - chat_count)
            else:
                chat_count = 1
                sub_type = "free"
                sub_status = "inactive"
                chats_remaining = 99

            return Response({
                "reply": reply_text,
                "chat_count": chat_count,
                "subscription_type": sub_type,
                "subscription_status": sub_status,
                "chats_remaining": chats_remaining
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Unexpected error in ChatbotAPIView: {str(e)}", exc_info=True)
            return Response(
                {
                    "error": "Service Error",
                    "message": "An unexpected error occurred while processing your message. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BloomBotFeedbackView(APIView):
    """
    API View to handle user feedback (Helpful / Not Helpful) on BloomBot AI responses.
    POST /api/chat/feedback/
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = BloomBotFeedbackSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation error in feedback submission.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user_prompt = serializer.validated_data.get('user_prompt')
        ai_response = serializer.validated_data.get('ai_response')

        # Anti-spam check: check duplicate submission within last 10 seconds
        recent_cutoff = timezone.now() - timedelta(seconds=10)
        existing_duplicate = BloomBotFeedback.objects.filter(
            user_prompt=user_prompt,
            ai_response=ai_response,
            created_at__gte=recent_cutoff
        ).exists()

        if existing_duplicate:
            return Response(
                {
                    "success": True,
                    "message": "Feedback already recorded. Thank you for sharing your thoughts! 🌸"
                },
                status=status.HTTP_200_OK
            )

        user = request.user if request.user and request.user.is_authenticated else None
        feedback_obj = serializer.save(user=user)

        return Response(
            {
                "success": True,
                "message": "Thanks for taking a moment to share that. It helps us make BloomBot more thoughtful over time. 🌸",
                "data": BloomBotFeedbackSerializer(feedback_obj).data
            },
            status=status.HTTP_201_CREATED
        )


class BloomBotRetryView(APIView):
    """
    API View to regenerate a fresh BloomBot AI response using the same user prompt.
    POST /api/chat/retry/
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = BloomBotRetrySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation error in retry request.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user_message = serializer.validated_data['message']
        history = serializer.validated_data.get('history', [])
        previous_response = serializer.validated_data.get('previous_response', '')

        try:
            service = GeminiChatbotService()
            fresh_reply = service.generate_reply(
                message=user_message,
                history=history,
                is_retry=True,
                previous_response=previous_response
            )

            return Response(
                {
                    "success": True,
                    "message": "Regenerated response successfully.",
                    "reply": fresh_reply
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in BloomBotRetryView: {str(e)}", exc_info=True)
            return Response(
                {
                    "success": False,
                    "message": "Failed to regenerate response. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BloomBotAdminFeedbackView(APIView):
    """
    API View providing BloomBot Insights & Analytics for Administrators.
    GET /api/admin/bloombot-feedback/
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        feedbacks = BloomBotFeedback.objects.all()
        total_feedback = feedbacks.count()

        helpful_qs = feedbacks.filter(feedback_type='Helpful')
        not_helpful_qs = feedbacks.filter(feedback_type='Not Helpful')

        helpful_count = helpful_qs.count()
        not_helpful_count = not_helpful_qs.count()

        helpful_pct = round((helpful_count / total_feedback) * 100, 1) if total_feedback > 0 else 100.0

        # Collect reason statistics
        helpful_reasons = []
        for f in helpful_qs:
            if isinstance(f.selected_reasons, list):
                helpful_reasons.extend(f.selected_reasons)
        most_common_helpful = dict(Counter(helpful_reasons).most_common(5))

        negative_reasons = []
        for f in not_helpful_qs:
            if isinstance(f.selected_reasons, list):
                negative_reasons.extend(f.selected_reasons)
        most_common_negative = dict(Counter(negative_reasons).most_common(5))

        recent_feedbacks = BloomBotFeedbackSerializer(feedbacks[:15], many=True).data

        return Response(
            {
                "success": True,
                "message": "BloomBot insights retrieved successfully.",
                "data": {
                    "total_conversations": total_feedback,
                    "helpful_responses": helpful_count,
                    "not_helpful_responses": not_helpful_count,
                    "helpful_percentage": helpful_pct,
                    "most_selected_helpful_reasons": most_common_helpful,
                    "most_selected_negative_reasons": most_common_negative,
                    "recent_feedback": recent_feedbacks
                }
            },
            status=status.HTTP_200_OK
        )
