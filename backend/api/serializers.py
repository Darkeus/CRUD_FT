from django.contrib.auth.models import User
from rest_framework import serializers
from  .models import Campain

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CampainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campain
        fields = ['id', 'name', 'keywords', 'bidAmount', 'founds', 'status', 'town', 'radius', 'author']
        read_only_fields = ['id', 'author']
        

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return Campain.objects.create(**validated_data)