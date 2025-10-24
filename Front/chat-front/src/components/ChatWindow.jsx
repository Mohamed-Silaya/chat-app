import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatAPI } from '../services/api';

const ChatWindow = ({ roomName, username, onRoomChange }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const threshold = 100;
      const isBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setIsAtBottom(isBottom);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Load messages and setup WebSocket
  useEffect(() => {
    if (roomName) {
      loadPreviousMessages();
      setupWebSocket();
    }
    return () => {
      if (socket) socket.close();
    };
  }, [roomName]);

  // Auto-scroll ONLY if user is at bottom
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && containerRef.current) {
      // Use scrollIntoView with block: 'end' to prevent page scroll
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const loadPreviousMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(roomName);
      const previousMessages = response.data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: { username: msg.username || msg.sender?.username },
        timestamp: msg.timestamp,
        isSystem: false
      }));
      setMessages(previousMessages);
      // Force scroll to bottom after loading
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    if (socket) socket.close();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/chat/${roomName}/`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => setConnectionStatus('connected');
    newSocket.onclose = () => setConnectionStatus('disconnected');
    newSocket.onerror = () => setConnectionStatus('error');

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          setMessages(prev => {
            const exists = prev.some(m => m.id === data.message_id);
            if (exists) return prev;
            return [...prev, {
              id: data.message_id || Date.now().toString(),
              content: data.message,
              sender: { username: data.username },
              timestamp: data.timestamp || new Date().toISOString(),
              isSystem: false
            }];
          });
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    };

    setSocket(newSocket);
  };

  const sendMessage = (message) => {
    if (socket?.readyState === WebSocket.OPEN && message.trim()) {
      socket.send(JSON.stringify({ type: 'chat_message', message, username }));
    }
  };

  const reconnect = () => {
    setupWebSocket();
    loadPreviousMessages();
  };

  const leaveRoom = () => {
    if (socket) socket.close();
    onRoomChange(null);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="room-info">
          <h3>{roomName}</h3>
          <div className="connection-status">
            <span className={`status ${connectionStatus}`}>
              {connectionStatus === 'connected' ? '🟢 Connected' :
               connectionStatus === 'error' ? '🔴 Error' : '🟡 Disconnected'}
            </span>
            <span className="message-count">({messages.length})</span>
          </div>
        </div>
        <div className="chat-actions">
          <button onClick={reconnect} className="btn btn-reconnect" title="Reconnect">
            🔄
          </button>
          <button onClick={leaveRoom} className="btn btn-leave">
            🚪 Leave
          </button>
        </div>
      </div>

      <div className="message-list-container" ref={containerRef}>
        {loading ? (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        ) : (
          <MessageList messages={messages} currentUser={username} />
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

const MessageSkeleton = () => (
  <div className="message-skeleton">
    <div className="skeleton-avatar"></div>
    <div className="skeleton-content">
      <div className="skeleton-line short"></div>
      <div className="skeleton-line long"></div>
    </div>
  </div>
);

export default ChatWindow;