from rest_framework import permissions


class IsOwnerOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a journal entry to view, edit, or delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
