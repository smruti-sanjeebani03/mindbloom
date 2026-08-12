from rest_framework import permissions


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom DRF permission:
    - SAFE_METHODS (GET, HEAD, OPTIONS): Allowed for all users (regular and anonymous).
    - Write actions (POST, PUT, PATCH, DELETE): Allowed only for authenticated admin users (is_staff or is_superuser).
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser)
        )
