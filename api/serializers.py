from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'text', 'children', 'creator', 'created_at', 'updated_at', 'level')


class CommentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('text', )
