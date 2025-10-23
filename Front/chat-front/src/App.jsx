import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import { chatAPI } from './services/api';
import './styles/App.css';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [tempUsername, setTempUsername] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      loadDashboardData();
    }
  }, [currentRoom]);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, conversationsResponse] = await Promise.all([
        chatAPI.getDashboardStats(),
        chatAPI.getConversations()
      ]);
      setStats(statsResponse.data);
      setConversations(conversationsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogin = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const handleLogout = () => {
    setUsername('');
    setTempUsername('');
    setCurrentRoom(null);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

if (!username) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Chat System</h2>
          <p>Enter your username to start chatting</p>
        </div>
        <div className="login-input-group">
          <input
            type="text"
            placeholder="Your username..."
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="login-input"
            autoFocus
          />
          <button 
            onClick={handleLogin}
            className="login-button"
            disabled={!tempUsername.trim()}
          >
            Get Started
          </button>
        </div>
        <div className="login-features">
          <div className="feature">
            <span>💬</span>
            <p>Real-time messaging</p>
          </div>
          <div className="feature">
            <span>👥</span>
            <p>Multiple conversations</p>
          </div>
          <div className="feature">
            <span>📊</span>
            <p>Activity analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="app">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="header-content">
            {!isSidebarCollapsed && <h3>Chat System</h3>}
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <div className="user-info">
              <div className="user-badge">
                <span className="user-avatar">👤</span>
                <span className="username">{username}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                Logout
              </button>
            </div>
          )}
        </div>

        {!isSidebarCollapsed && (
          <>
            <Dashboard stats={stats} />
            <ConversationList
              conversations={conversations}
              currentRoom={currentRoom}
              onRoomSelect={setCurrentRoom}
              onRefresh={loadDashboardData}
            />
          </>
        )}
      </div>

      <div className="main-content">
        {currentRoom ? (
          <ChatWindow
            roomName={currentRoom}
            username={username}
            onRoomChange={setCurrentRoom}
          />
        ) : (
          <div className="welcome-message">
            <div className="welcome-icon">💬</div>
            <h2>Welcome to Chat System</h2>
            <p>Select a conversation from the sidebar to start chatting</p>

            {stats && (
              <div className="welcome-stats">
                <div className="stat-card">
                  <h3>{stats.total_conversations}</h3>
                  <p>Conversations</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.total_messages}</h3>
                  <p>Messages</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.total_users}</h3>
                  <p>Users</p>
                </div>
              </div>
            )}

        
          </div>
        )}
      </div>
    </div>
  );
}

export default App;