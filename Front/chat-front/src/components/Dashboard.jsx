import React from 'react';

const Dashboard = ({ stats }) => {
  if (!stats) {
    return (
      <div className="dashboard">
        <h4>Dashboard</h4>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h4>Dashboard</h4>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{stats.total_conversations}</div>
          <div className="stat-label">Conversations</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">{stats.total_messages}</div>
          <div className="stat-label">Messages</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.total_users}</div>
          <div className="stat-label">Users</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;