from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CampainSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Campain, Profile  # Dodaj import Profile
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework import status
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal  # Importuj Decimal

class CampainViewSet(viewsets.ModelViewSet):
    serializer_class = CampainSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Campain.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CampainListCreate(generics.ListCreateAPIView):
    serializer_class = CampainSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Campain.objects.filter(author=user)

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except ValidationError as e:
            raise e


class CampainDelete(generics.DestroyAPIView):
    serializer_class = CampainSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Campain.objects.filter(author=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')  # Pobierz PK z URL
        if pk is not None:
            return generics.get_object_or_404(queryset, pk=pk)
        else:
            return None


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    emerald_funds = user.profile.emerald_funds if hasattr(user, 'profile') else 0  # Assuming `emerald_funds` is in a related `Profile` model
    return Response({
        "username": user.username,
        "emeraldFunds": emerald_funds
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_funds(request):
    user = request.user
    try:
        # Assuming `emerald_funds` is in a related `Profile` model
        if hasattr(user, 'profile'):
            user.profile.emerald_funds += 1000
            user.profile.save()
            return Response({"emeraldFunds": user.profile.emerald_funds}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Profile not found"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subtract_funds(request):
    user = request.user
    try:
        if not hasattr(user, 'profile'):
            user.profile = Profile.objects.create(user=user, emerald_funds=Decimal('0'))

        amount = request.data.get('amount')
        if amount is None:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = Decimal(amount)  
        except (ValueError, TypeError):
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

       
        if user.profile.emerald_funds >= amount:
            user.profile.emerald_funds -= amount
            user.profile.save()
            return Response({"emeraldFunds": user.profile.emerald_funds}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()