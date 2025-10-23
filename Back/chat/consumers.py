import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from .models import Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # انضم للمجموعة أولاً
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        
        print(f"✅ WebSocket connected to room: {self.room_name}")
        
        # أرسل رسالة ترحيب
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'message': f'Connected to room: {self.room_name}',
            'username': 'System'
        }))

    async def disconnect(self, close_code):
        print(f"🔌 WebSocket disconnected from room: {self.room_name}")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get('message', '')
            username = data.get('username', 'anonymous')
            
            print(f"📨 Received from {username}: {message}")
            
            # حفظ الرسالة
            saved = await self.save_message(username, message)
            
            if saved:
                # إرسال للمجموعة
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'username': username,
                        'message_id': saved['id'],
                        'timestamp': saved['timestamp']
                    }
                )
                
        except Exception as e:
            print(f"❌ Error: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'username': event['username'],
            'message_id': event['message_id'],
            'timestamp': event['timestamp']
        }))

    @sync_to_async
    def save_message(self, username, content):
        try:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'password': 'default'}
            )
            
            conversation, created = Conversation.objects.get_or_create(
                name=self.room_name
            )
            
            if user not in conversation.participants.all():
                conversation.participants.add(user)
            
            message = Message.objects.create(
                conversation=conversation,
                sender=user,
                content=content
            )
            
            print(f"💾 Saved message ID: {message.id}")
            return {
                'id': message.id,
                'timestamp': message.timestamp.isoformat()
            }
            
        except Exception as e:
            print(f"❌ Save error: {e}")
            return None