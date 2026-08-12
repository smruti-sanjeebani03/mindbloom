from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from stories.urls import admin_urlpatterns as stories_admin_urls
from inspire.views import TestimonialListCreateView
from accounts.views import (
    UserSubscriptionView,
    CreatePaymentOrderView,
    VerifyPaymentView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth APIs
    path('api/auth/', include('accounts.urls')),
    
    # Direct Payment & Subscription APIs
    path('api/user/subscription/', UserSubscriptionView.as_view(), name='direct-user-subscription'),
    path('api/payment/create-order/', CreatePaymentOrderView.as_view(), name='direct-create-payment-order'),
    path('api/payment/verify/', VerifyPaymentView.as_view(), name='direct-verify-payment'),
    path('api/payment/status/', UserSubscriptionView.as_view(), name='direct-payment-status'),
    
    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Chatbot APIs
    path('api/', include('chatbot.urls')),
    
    # Journal APIs
    path('api/journal/', include('journal.urls')),
    
    # Mood Tracking APIs
    path('api/moods/', include('moods.urls')),
    
    # Inspire APIs
    path('api/inspire/', include('inspire.urls')),
    
    # Reflection APIs
    path('api/reflection/', include('reflection.urls')),
    
    # Bloom Stories APIs
    path('api/stories/', include('stories.urls')),
    
    # Admin APIs
    path('api/admin/', include(stories_admin_urls)),

    path(
    'api/testimonials/',
    TestimonialListCreateView.as_view(),
    name='testimonials',
)
]
