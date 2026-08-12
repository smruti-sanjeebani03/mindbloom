from django.urls import path
from .views import MoodListCreateView, MoodDetailView, MoodAnalyticsView

urlpatterns = [
    path('', MoodListCreateView.as_view(), name='mood-list-create'),
    path('analytics/', MoodAnalyticsView.as_view(), name='mood-analytics'),
    path('<int:pk>/', MoodDetailView.as_view(), name='mood-detail'),
]
