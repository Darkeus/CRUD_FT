from django.urls import path
from . import views

urlpatterns = [
    path('campains/', views.CampainListCreate.as_view(), name='campaign-list-create'),
    path('campains/<int:pk>/', views.CampainDelete.as_view(), name='campaign-delete'),
    ]