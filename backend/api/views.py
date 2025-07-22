from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CampainSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Campain
from rest_framework.exceptions import ValidationError


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