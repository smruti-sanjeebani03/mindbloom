from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated


class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return hasattr(obj, 'user') and obj.user == request.user
