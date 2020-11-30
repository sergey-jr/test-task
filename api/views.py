import json
from datetime import datetime

from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment
from .serializers import CommentSerializer, CommentPostSerializer


# Create your views here.

class CommentView(APIView):

    @staticmethod
    def get_object(pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise Http404

    def get(self, request, pk=None):
        if pk is None:
            # pdb.set_trace()
            comments = Comment.objects.all()
            serializer = CommentSerializer(comments, many=True)
        else:
            comment = self.get_object(pk)
            serializer = CommentSerializer(comment)
        response = json.loads(json.dumps(serializer.data))
        return Response(data=response, status=status.HTTP_200_OK)

    def post(self, request):
        data, user = request.data['data'], request.data['user']
        comment = CommentPostSerializer(data=data)
        if comment.is_valid():
            if request.data.get('parent'):
                parent = self.get_object(pk=request.data['parent'])
                comment.save(creator=user,
                             parent=parent,
                             updated_at=datetime.now(),
                             created_at=datetime.now())
            else:
                comment.save(creator=user,
                             updated_at=datetime.now(),
                             created_at=datetime.now())
            return Response(status=status.HTTP_201_CREATED)
        return Response(status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        saved_comment = get_object_or_404(Comment.objects.all(), pk=pk)
        data = request.data['data']
        serializer = CommentSerializer(instance=saved_comment, data=data, partial=True)
        if serializer.is_valid():
            serializer.save(updated_at=datetime.now())
            return Response(status=status.HTTP_200_OK)
        return Response(status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        comment = self.get_object(pk)
        children = comment.children
        if children.count() == 0:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data="")
        return Response(status=status.HTTP_409_CONFLICT, data="")
