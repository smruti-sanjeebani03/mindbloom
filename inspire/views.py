from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .models import Quote, Affirmation, Article, Newsletter, Testimonial
from .serializers import (
    QuoteSerializer,
    AffirmationSerializer,
    ArticleSerializer,
    NewsletterSerializer,
    TestimonialSerializer
)
from .permissions import IsAdminUserOrReadOnly


class TodayInspireView(APIView):
    """
    GET /api/inspire/today/
    Returns today's daily quote and affirmation.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        quotes = Quote.objects.filter(is_active=True).order_by('id')
        if not quotes.exists():
            quotes = Quote.objects.all().order_by('id')
        
        affirmations = Affirmation.objects.filter(is_active=True).order_by('id')
        if not affirmations.exists():
            affirmations = Affirmation.objects.all().order_by('id')

        days_since_epoch = timezone.now().date().toordinal()
        
        today_quote = QuoteSerializer(quotes[days_since_epoch % len(quotes)]).data if quotes.exists() else None
        today_affirmation = AffirmationSerializer(affirmations[days_since_epoch % len(affirmations)]).data if affirmations.exists() else None

        return Response({
            "success": True,
            "data": {
                "quote": today_quote,
                "affirmation": today_affirmation,
                "date": timezone.now().date().isoformat()
            }
        }, status=status.HTTP_200_OK)


class QuoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Quotes.
    - Regular Users: Read-only access (GET list & detail).
    - Administrators: Full CRUD permissions (POST, PUT, PATCH, DELETE).
    """
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    @action(detail=False, methods=['get'], url_path='today')
    def today(self, request):
        quotes = Quote.objects.filter(is_active=True).order_by('id')
        if not quotes.exists():
            quotes = Quote.objects.all().order_by('id')
        if not quotes.exists():
            return Response({
                "success": False,
                "message": "No quotes found."
            }, status=status.HTTP_404_NOT_FOUND)
        
        days_since_epoch = timezone.now().date().toordinal()
        quote = quotes[days_since_epoch % len(quotes)]
        serializer = self.get_serializer(quote)
        return Response({
            "success": True,
            "message": "Today's quote retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Quotes retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Quote details retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Quote created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation error while creating quote.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Quote updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Validation error while updating quote.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "message": "Quote deleted successfully."
        }, status=status.HTTP_200_OK)


class AffirmationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Affirmations.
    - Regular Users: Read-only access (GET list & detail).
    - Administrators: Full CRUD permissions.
    """
    queryset = Affirmation.objects.all()
    serializer_class = AffirmationSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    @action(detail=False, methods=['get'], url_path='today')
    def today(self, request):
        affirmations = Affirmation.objects.filter(is_active=True).order_by('id')
        if not affirmations.exists():
            affirmations = Affirmation.objects.all().order_by('id')
        if not affirmations.exists():
            return Response({
                "success": False,
                "message": "No affirmations found."
            }, status=status.HTTP_404_NOT_FOUND)
        
        days_since_epoch = timezone.now().date().toordinal()
        affirmation = affirmations[days_since_epoch % len(affirmations)]
        serializer = self.get_serializer(affirmation)
        return Response({
            "success": True,
            "message": "Today's affirmation retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Affirmations retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Affirmation details retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Affirmation created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation error while creating affirmation.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Affirmation updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Validation error while updating affirmation.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "message": "Affirmation deleted successfully."
        }, status=status.HTTP_200_OK)


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Articles.
    - Regular Users: Read-only access (GET list & detail).
    - Administrators: Full CRUD permissions.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Articles retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Article details retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Article created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation error while creating article.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Article updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Validation error while updating article.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "message": "Article deleted successfully."
        }, status=status.HTTP_200_OK)


class NewsletterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Newsletters.
    - Regular Users: Read-only access (GET list & detail).
    - Administrators: Full CRUD permissions.
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Newsletters retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Newsletter details retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Newsletter created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation error while creating newsletter.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Newsletter updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Validation error while updating newsletter.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "message": "Newsletter deleted successfully."
        }, status=status.HTTP_200_OK)


class TestimonialListCreateView(APIView):
    """
    GET /api/testimonials/
    List all testimonials stored in PostgreSQL.

    POST /api/testimonials/
    Create and save a new testimonial to PostgreSQL.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        testimonials = Testimonial.objects.all().order_by('-created_at')
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response({
            "success": True,
            "message": "Testimonials retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TestimonialSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if (request.user and request.user.is_authenticated) else None
            avatar = serializer.validated_data.get('avatar')
            name = serializer.validated_data.get('name') or "Anonymous Reviewer"
            if not avatar or not avatar.strip():
                import urllib.parse
                seed = urllib.parse.quote(name)
                avatar = f"https://api.dicebear.com/7.x/bottts-neutral/svg?seed={seed}&backgroundColor=efe6dc"

            testimonial = serializer.save(user=user, avatar=avatar)
            return Response({
                "success": True,
                "message": "Your review has been recorded in the backend and is now live on the page.",
                "data": TestimonialSerializer(testimonial).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation error while submitting review.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

