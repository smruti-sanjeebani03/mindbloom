from django.urls import path
from .views import (
    StoryListCreateView,
    StoryDetailView,
    StoryReportView,
    AdminStoryListView,
    AdminStoryDetailView,
    AdminStoryDismissReportView,
    AdminUserSuspendView,
    AdminUserReactivateView,
    AdminUserListView
)

urlpatterns = [
    # Public & User Story APIs
    path('', StoryListCreateView.as_view(), name='story_list_create'),
    path('<int:pk>/', StoryDetailView.as_view(), name='story_detail'),
    path('<int:pk>/report/', StoryReportView.as_view(), name='story_report'),
]

admin_urlpatterns = [
    path('users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('stories/', AdminStoryListView.as_view(), name='admin_story_list'),
    path('stories/<int:pk>/', AdminStoryDetailView.as_view(), name='admin_story_detail'),
    path('stories/<int:pk>/dismiss-report/', AdminStoryDismissReportView.as_view(), name='admin_story_dismiss_report'),
    path('users/<int:pk>/suspend/', AdminUserSuspendView.as_view(), name='admin_user_suspend'),
    path('users/<int:pk>/reactivate/', AdminUserReactivateView.as_view(), name='admin_user_reactivate'),
]
