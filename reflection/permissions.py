from rest_framework import permissions


class IsOwnerOnly(permissions.BasePermission):
    """
    Custom permission to ensure users can only access or modify their own reflection entries.
    """

    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.is_authenticated and obj.user == request.user)
