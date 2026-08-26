from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Story
from .serializers import StorySerializer, StoryReportSerializer


class StoryListCreateView(APIView):
    """
    Handles listing all community stories (GET) with filtering/limit options
    and publishing a new story (POST) for both authenticated users and guests.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Story.objects.all().order_by('-created_at')

        # Filter by category if provided
        category = request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category.strip())

        # Search filter
        search = request.query_params.get('search')
        if search:
            q = search.strip()
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(content__icontains=q) |
                Q(category__icontains=q)
            )

        # Homepage preview or pagination limit
        limit = request.query_params.get('limit')
        if limit:
            try:
                limit_num = int(limit)
                if limit_num > 0:
                    queryset = queryset[:limit_num]
            except ValueError:
                pass

        serializer = StorySerializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Community stories retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = StorySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation failed while sharing story.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        is_anon = request.data.get('is_anonymous', False)
        if isinstance(is_anon, str):
            is_anon = is_anon.lower() in ['true', '1', 'yes']

        if request.user and request.user.is_authenticated:
            # Authenticated user
            saved_story = serializer.save(
                user=request.user,
                is_anonymous=bool(is_anon)
            )
        else:
            # Guest user MUST be anonymous
            saved_story = serializer.save(
                user=None,
                is_anonymous=True
            )

        return Response(
            {
                "success": True,
                "message": "Story shared successfully.",
                "data": StorySerializer(saved_story).data
            },
            status=status.HTTP_201_CREATED
        )


class StoryDetailView(APIView):
    """
    Handles retrieving (GET), updating (PUT/PATCH), and deleting (DELETE)
    a specific story entry. Editing and deletion are strictly restricted to the story owner.
    """
    permission_classes = [AllowAny]

    def get_object(self, pk):
        return get_object_or_404(Story, pk=pk)

    def get(self, request, pk):
        try:
            story = self.get_object(pk)
        except Exception:
            return Response(
                {
                    "success": False,
                    "message": f"Story with ID {pk} not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = StorySerializer(story)
        return Response(
            {
                "success": True,
                "message": "Story details retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial=False):
        try:
            story = self.get_object(pk)
        except Exception:
            return Response(
                {
                    "success": False,
                    "message": f"Story with ID {pk} not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.user or not request.user.is_authenticated:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required to edit stories."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Enforce owner edit permission
        if story.user is None or story.user != request.user:
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to edit this story."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = StorySerializer(story, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation failed while updating story.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        updated_story = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Story updated successfully.",
                "data": StorySerializer(updated_story).data
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        try:
            story = self.get_object(pk)
        except Exception:
            return Response(
                {
                    "success": False,
                    "message": f"Story with ID {pk} not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.user or not request.user.is_authenticated:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required to delete stories."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Enforce owner delete permission
        if story.user is None or story.user != request.user:
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to delete this story."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        story.delete()
        return Response(
            {
                "success": True,
                "message": "Story deleted successfully."
            },
            status=status.HTTP_200_OK
        )


class StoryReportView(APIView):
    """
    Handles submitting a report for a specific story (POST /api/stories/<id>/report/).
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            story = get_object_or_404(Story, pk=pk)
        except Exception:
            return Response(
                {
                    "success": False,
                    "message": f"Story with ID {pk} not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = StoryReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation failed while reporting story.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = serializer.validated_data['reason']
        story.is_reported = True
        story.report_reason = reason
        story.save()

        return Response(
            {
                "success": True,
                "message": "Thank you for reporting this story. Our moderation team will review it shortly."
            },
            status=status.HTTP_201_CREATED
        )


# ==========================================
# ADMIN STORY MANAGEMENT & USER ACTION VIEWS
# ==========================================

class AdminStoryListView(APIView):
    """
    GET /api/admin/stories/
    Returns all stories and summary analytics for the administrator dashboard.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.now().date()
        all_stories = Story.objects.all().order_by('-created_at')

        total_stories = all_stories.count()
        anonymous_stories = all_stories.filter(Q(is_anonymous=True) | Q(user__isnull=True)).count()
        reported_stories = all_stories.filter(is_reported=True).count()
        published_today = all_stories.filter(created_at__date=today).count()

        serializer = StorySerializer(all_stories, many=True)
        return Response(
            {
                "success": True,
                "summary": {
                    "total_stories": total_stories,
                    "anonymous_stories": anonymous_stories,
                    "reported_stories": reported_stories,
                    "published_today": published_today
                },
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class AdminStoryDetailView(APIView):
    """
    GET /api/admin/stories/<id>/
    DELETE /api/admin/stories/<id>/
    Admin endpoint to view or delete any story.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        return Response(
            {
                "success": True,
                "data": StorySerializer(story).data
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        story.delete()
        return Response(
            {
                "success": True,
                "message": "Story removed successfully from public visibility."
            },
            status=status.HTTP_200_OK
        )


class AdminStoryDismissReportView(APIView):
    """
    POST /api/admin/stories/<id>/dismiss-report/
    Admin endpoint to dismiss report on a story.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        story.is_reported = False
        story.report_reason = None
        story.save()

        return Response(
            {
                "success": True,
                "message": "Report dismissed successfully.",
                "data": StorySerializer(story).data
            },
            status=status.HTTP_200_OK
        )


class AdminUserSuspendView(APIView):
    """
    POST /api/admin/users/<id>/suspend/
    Admin endpoint to suspend a user without deleting their account.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_active = False
        user.save()

        return Response(
            {
                "success": True,
                "message": f"User '{user.first_name or user.username}' has been suspended successfully."
            },
            status=status.HTTP_200_OK
        )


class AdminUserReactivateView(APIView):
    """
    POST /api/admin/users/<id>/reactivate/
    Admin endpoint to reactivate a suspended user.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_active = True
        user.save()

        return Response(
            {
                "success": True,
                "message": f"User '{user.first_name or user.username}' has been reactivated successfully."
            },
            status=status.HTTP_200_OK
        )


class AdminUserListView(APIView):
    """
    GET /api/admin/users/
    Admin endpoint to list all registered users.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        users = users = User.objects.filter(
        is_staff=False,
        is_superuser=False
        ).order_by("-date_joined")
        data = []
        for u in users:
            profile = getattr(u, 'userprofile', None)
            data.append({
                "id": u.id,
                "email": u.email,
                "name": u.first_name or u.username,
                "is_active": u.is_active,
                "is_staff": u.is_staff,
                "subscription_type": profile.subscription_type if profile else "free",
                "subscription_status": profile.subscription_status if profile else "active",
                "date_joined": u.date_joined.isoformat() if u.date_joined else None
            })
        return Response({"success": True, "data": data}, status=status.HTTP_200_OK)

