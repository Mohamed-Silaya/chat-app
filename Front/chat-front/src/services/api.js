import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const chatAPI = {
  // إحصائيات الـ Dashboard
  getDashboardStats: () => api.get('/api/dashboard/stats/'),
  
  // المحادثات
  getConversations: () => api.get('/api/conversations/'),
  getConversation: (name) => api.get(`/api/conversations/${name}/`),
  
  // الرسائل
  getMessages: (roomName) => api.get(`/api/conversations/${roomName}/messages/`),
};

export default api;