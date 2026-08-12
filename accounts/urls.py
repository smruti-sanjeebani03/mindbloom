from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    AdminLoginView,
    LoginOrRegisterView,
    LogoutView,
    ForgotPasswordView,
    ResetPasswordView,
    UserProfileView,
    GoogleOAuthView,
    UserSubscriptionView,
    CreatePaymentOrderView,
    VerifyPaymentView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('admin-login/', AdminLoginView.as_view(), name='auth-admin-login'),
    path('login-or-register/', LoginOrRegisterView.as_view(), name='auth-login-or-register'),
    path('google/', GoogleOAuthView.as_view(), name='auth-google'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='auth-reset-password'),
    path('profile/', UserProfileView.as_view(), name='auth-profile'),
    path('subscription/', UserSubscriptionView.as_view(), name='user-subscription'),
    path('payment/create-order/', CreatePaymentOrderView.as_view(), name='create-payment-order'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
]

