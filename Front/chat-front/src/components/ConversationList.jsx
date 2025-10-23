
import React, { useState } from 'react';

const ConversationList = ({ conversations, currentRoom, onRoomSelect, onRefresh }) => {
  const [newRoomName, setNewRoomName] = useState('');

  const createRoom = () => {
    if (newRoomName.trim()) {
      onRoomSelect(newRoomName.trim());
      setNewRoomName('');
      setTimeout(onRefresh, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createRoom();
    }
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h4> Conversations</h4>
        <button onClick={onRefresh} className="refresh-button" title="Refresh">
          🔄
        </button>
      </div>

      <div className="create-room">
        <input
          type="text"
          placeholder="New conversation name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="room-input"
        />
        <button onClick={createRoom} className="create-button">
          Create
        </button>
      </div>

      <div className="conversations">
        {conversations.length === 0 ? (
          <p className="no-conversations">No conversations yet</p>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${currentRoom === conversation.name ? 'active' : ''}`}
              onClick={() => onRoomSelect(conversation.name)}
            >
              <div className="conversation-info">
                <div className="conversation-name">{conversation.name}</div>
                <div className="conversation-meta">
                  <span className="message-count">{conversation.message_count} messages</span>
                  <span className="participant-count">{conversation.participants.length} participants</span>
                </div>
                {conversation.last_message && (
                  <div className="last-message">
                    {conversation.last_message.content.slice(0, 50)}...
                  </div>
                )}
              </div>
              <div className="conversation-time">
                {new Date(conversation.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;