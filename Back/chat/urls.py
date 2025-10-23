from django.urls import path
from . import views

urlpatterns = [
    path('api/conversations/', views.ConversationListAPI.as_view(), name='conversation-list'),
    path('api/conversations/<str:name>/', views.ConversationDetailAPI.as_view(), name='conversation-detail'),
    path('api/conversations/<str:room_name>/messages/', views.MessageListAPI.as_view(), name='message-list'),
    path('api/dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]