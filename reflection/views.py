from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Gratitude, SelfTalk
from .serializers import GratitudeSerializer, SelfTalkSerializer


class GratitudeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Gratitude entries.
    - Requires JWT Authentication.
    - Isolates records so users can only access their own gratitude entries.
    - Supports filtering by date query parameter: ?date=YYYY-MM-DD
    - Sorts entries by newest first.
    """
    serializer_class = GratitudeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            qs = Gratitude.objects.filter(user=self.request.user)
            date_param = self.request.query_params.get('date') or self.request.query_params.get('reflection_date')
            if date_param:
                qs = qs.filter(reflection_date=date_param)
            return qs.order_by('-created_at')
        return Gratitude.objects.none()

    def perform_create(self, serializer):
        kwargs = {'user': self.request.user}
        if 'reflection_date' not in serializer.validated_data:
            kwargs['reflection_date'] = timezone.now().date()
        serializer.save(**kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Gratitude entries retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            "success": True,
            "message": "Gratitude reflection saved successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Gratitude entry retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "success": True,
            "message": "Gratitude entry updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "success": True,
            "message": "Gratitude entry deleted successfully."
        }, status=status.HTTP_200_OK)


class SelfTalkViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Self-Talk entries.
    - Requires JWT Authentication.
    - Isolates records so users can only access their own self-talk entries.
    - Supports filtering by date query parameter: ?date=YYYY-MM-DD
    - Sorts entries by newest first.
    """
    serializer_class = SelfTalkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            qs = SelfTalk.objects.filter(user=self.request.user)
            date_param = self.request.query_params.get('date') or self.request.query_params.get('reflection_date')
            if date_param:
                qs = qs.filter(reflection_date=date_param)
            return qs.order_by('-created_at')
        return SelfTalk.objects.none()

    def perform_create(self, serializer):
        kwargs = {'user': self.request.user}
        if 'reflection_date' not in serializer.validated_data:
            kwargs['reflection_date'] = timezone.now().date()
        serializer.save(**kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Self-talk entries retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            "success": True,
            "message": "Self-talk entry saved successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Self-talk entry retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "success": True,
            "message": "Self-talk entry updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "success": True,
            "message": "Self-talk entry deleted successfully."
        }, status=status.HTTP_200_OK)