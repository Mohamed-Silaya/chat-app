from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.db.models import Count

class ConversationListAPI(generics.ListAPIView):
    queryset = Conversation.objects.all().prefetch_related('participants', 'messages')
    serializer_class = ConversationSerializer

class ConversationDetailAPI(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    lookup_field = 'name'

class MessageListAPI(generics.ListAPIView):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        room_name = self.kwargs['room_name']
        return Message.objects.filter(conversation__name=room_name).select_related('sender')

@api_view(['GET'])
def dashboard_stats(request):
    """إحصائيات الـ Dashboard"""
    total_conversations = Conversation.objects.count()
    total_messages = Message.objects.count()
    total_users = Conversation.objects.aggregate(
        total_users=Count('participants', distinct=True)
    )['total_users']
    
    recent_conversations = Conversation.objects.all().order_by('-updated_at')[:10]
    recent_conversations_data = ConversationSerializer(recent_conversations, many=True).data
    
    return Response({
        'total_conversations': total_conversations,
        'total_messages': total_messages,
        'total_users': total_users,
        'recent_conversations': recent_conversations_data
    })