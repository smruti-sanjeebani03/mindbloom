from collections import Counter
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Mood, MoodChoice
from .serializers import MoodSerializer
from .permissions import IsOwnerOnly


class MoodListCreateView(APIView):
    """
    Handles listing mood history (GET) with filtering and recording a new mood (POST).
    Only returns records belonging to the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Mood.objects.filter(user=request.user)

        # Optional filtering by mood string
        mood_filter = request.query_params.get('mood')
        if mood_filter:
            queryset = queryset.filter(mood__iexact=mood_filter.strip())

        # Optional filtering by date YYYY-MM-DD
        date_filter = request.query_params.get('date')
        if date_filter:
            queryset = queryset.filter(created_at__date=date_filter.strip())

        serializer = MoodSerializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Mood history retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = MoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "success": True,
                    "message": "Mood recorded successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while recording mood.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class MoodDetailView(APIView):
    """
    Handles retrieving (GET), updating (PUT/PATCH), and deleting (DELETE)
    a single mood entry for the authenticated user.
    """
    permission_classes = [IsAuthenticated, IsOwnerOnly]

    def get_object(self, pk, user):
        return get_object_or_404(Mood, pk=pk, user=user)

    def get(self, request, pk):
        mood_entry = self.get_object(pk, request.user)
        self.check_object_permissions(request, mood_entry)
        serializer = MoodSerializer(mood_entry)
        return Response(
            {
                "success": True,
                "message": "Mood entry details retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        mood_entry = self.get_object(pk, request.user)
        self.check_object_permissions(request, mood_entry)
        serializer = MoodSerializer(mood_entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Mood entry updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while updating mood entry.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        mood_entry = self.get_object(pk, request.user)
        self.check_object_permissions(request, mood_entry)
        serializer = MoodSerializer(mood_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Mood entry updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while updating mood entry.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        mood_entry = self.get_object(pk, request.user)
        self.check_object_permissions(request, mood_entry)
        mood_entry.delete()
        return Response(
            {
                "success": True,
                "message": "Mood entry deleted successfully."
            },
            status=status.HTTP_200_OK
        )


class MoodAnalyticsView(APIView):
    """
    Computes mood distribution and summary metrics for the authenticated user.
    GET /api/moods/analytics/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_moods = Mood.objects.filter(user=request.user)
        total_entries = user_moods.count()

        if total_entries == 0:
            return Response(
                {
                    "success": True,
                    "message": "Mood analytics generated successfully.",
                    "data": {
                        "total_entries": 0,
                        "most_common_mood": None,
                        "mood_distribution": {}
                    }
                },
                status=status.HTTP_200_OK
            )

        counts = Counter(user_moods.values_list('mood', flat=True))
        most_common = counts.most_common(1)[0][0] if counts else None
        distribution = dict(counts)

        return Response(
            {
                "success": True,
                "message": "Mood analytics generated successfully.",
                "data": {
                    "total_entries": total_entries,
                    "most_common_mood": most_common,
                    "mood_distribution": distribution
                }
            },
            status=status.HTTP_200_OK
        )
