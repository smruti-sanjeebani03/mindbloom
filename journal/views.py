from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Journal
from .serializers import JournalSerializer
from .permissions import IsOwnerOnly




class JournalListCreateView(APIView):
    """
    Handles listing all journal entries for the authenticated user (GET)
    and creating a new journal entry (POST).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        journals = Journal.objects.filter(user=request.user)
        serializer = JournalSerializer(journals, many=True)
        return Response(
            {
                "success": True,
                "message": "Journal entries retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "success": True,
                    "message": "Journal entry created successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while creating journal entry.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class JournalDetailView(APIView):
    """
    Handles retrieving (GET), updating (PUT/PATCH), and deleting (DELETE)
    a specific journal entry belonging to the authenticated user.
    """
    permission_classes = [IsAuthenticated, IsOwnerOnly]

    def get_object(self, pk, user):
        # Enforces isolation: Returns 404 if the entry does not exist or belongs to another user
        return get_object_or_404(Journal, pk=pk, user=user)

    def get(self, request, pk):
        journal = self.get_object(pk, request.user)
        self.check_object_permissions(request, journal)
        serializer = JournalSerializer(journal)
        return Response(
            {
                "success": True,
                "message": "Journal entry retrieved successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        journal = self.get_object(pk, request.user)
        self.check_object_permissions(request, journal)
        serializer = JournalSerializer(journal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Journal entry updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while updating journal entry.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        journal = self.get_object(pk, request.user)
        self.check_object_permissions(request, journal)
        serializer = JournalSerializer(journal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Journal entry updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "success": False,
                "message": "Validation failed while updating journal entry.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        journal = self.get_object(pk, request.user)
        self.check_object_permissions(request, journal)
        journal.delete()
        return Response(
            {
                "success": True,
                "message": "Journal entry deleted successfully."
            },
            status=status.HTTP_200_OK
        )
