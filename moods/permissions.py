from rest_framework import permissions


class IsOwnerOnly(permissions.BasePermission):
    """
    Object-level permission allowing users to access only their own mood entries.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
