import React, { useState, useEffect } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.querySelector('.message-field');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          className="message-field"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows="1"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim()}
        >
          📤 Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;