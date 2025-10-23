import React from 'react';

const MessageList = ({ messages, currentUser }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          <div className="no-messages-icon">💬</div>
          <p>No messages yet</p>
          <p>Send the first message!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender?.username === currentUser ? 'own-message' : ''}`}
          >
            <div className="message-header">
              <strong className="sender-name">
                {msg.sender?.username === currentUser ? 'You' : msg.sender?.username || 'User'}
              </strong>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;