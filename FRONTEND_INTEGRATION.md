# Frontend Integration Guide

This guide shows how to integrate the KAYA React frontend with the new production backend.

## Quick Start

### 1. Install Axios in Frontend
```powershell
cd ..  # Go back to KAYA root directory
npm install axios socket.io-client
```

### 2. Create API Service File

Create `services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken })
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getStats: () => api.get('/users/me/stats')
};

// Session API
export const sessionAPI = {
  create: (data: any) => api.post('/sessions', data),
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('/sessions', { params }),
  getById: (id: string) => api.get(`/sessions/${id}`),
  complete: (id: string, data: any) =>
    api.patch(`/sessions/${id}/complete`, data),
  getStats: () => api.get('/sessions/stats')
};

// Program API
export const programAPI = {
  getAll: () => api.get('/programs'),
  getById: (id: string) => api.get(`/programs/${id}`),
  enroll: (id: string) => api.post(`/programs/${id}/enroll`),
  getEnrollments: () => api.get('/programs/enrollments/my'),
  updateProgress: (id: string, currentDay: number) =>
    api.patch(`/programs/enrollments/${id}/progress`, { currentDay })
};

// Journal API
export const journalAPI = {
  createEntry: (data: any) => api.post('/journal', data),
  getEntries: () => api.get('/journal'),
  addGratitude: (word: string) => api.post('/journal/gratitude', { word }),
  logMood: (data: any) => api.post('/journal/mood', data),
  getMoodHistory: (days: number = 30) =>
    api.get(`/journal/mood/history?days=${days}`)
};

// Community API
export const communityAPI = {
  getPosts: (params?: { category?: string; limit?: number; offset?: number }) =>
    api.get('/community', { params }),
  createPost: (data: any) => api.post('/community', data),
  likePost: (id: string) => api.post(`/community/${id}/like`),
  unlikePost: (id: string) => api.delete(`/community/${id}/unlike`),
  getComments: (postId: string) => api.get(`/community/${postId}/comments`),
  addComment: (postId: string, content: string) =>
    api.post(`/community/${postId}/comments`, { content })
};

// AI API
export const aiAPI = {
  generateSession: (data: {
    mood: string;
    goals: string[];
    sessionLength: string;
  }) => api.post('/ai/session/generate', data),
  
  generateSleepStory: (theme?: string) =>
    api.post('/ai/sleep-story/generate', { theme }),
  
  getMoodInsights: (moodHistory: any[]) =>
    api.post('/ai/mood/insights', { moodHistory }),
  
  chat: (messages: any[]) => api.post('/ai/chat', { messages })
};

// Achievement API
export const achievementAPI = {
  getUnlocked: () => api.get('/achievements'),
  getAvailable: () => api.get('/achievements/available')
};

// Event API
export const eventAPI = {
  getAll: (params?: { category?: string }) =>
    api.get('/events', { params }),
  register: (id: string) => api.post(`/events/${id}/register`),
  getMyRegistrations: () => api.get('/events/my-registrations')
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMoodTrends: (days: number = 30) =>
    api.get(`/analytics/mood-trends?days=${days}`),
  getActivityBreakdown: () => api.get('/analytics/activity-breakdown')
};

export default api;
```

### 3. Create WebSocket Service

Create `services/socket.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(WS_URL, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
```

### 4. Update Environment Variables

Create `.env.local` in frontend root:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=http://localhost:5000
GEMINI_API_KEY=your-api-key-here
```

### 5. Update App.tsx to Use Backend

Replace the mock data calls with real API calls:

```typescript
import { useEffect } from 'react';
import { userAPI, sessionAPI, programAPI } from './services/api';

// In your component
useEffect(() => {
  const loadUserData = async () => {
    try {
      const { data } = await userAPI.getProfile();
      setUserProfile(data.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  if (token) {
    loadUserData();
  }
}, [token]);

// To create a session
const handleCompleteSession = async (sessionData: any) => {
  try {
    const { data } = await sessionAPI.complete(sessionId, sessionData);
    console.log('Session completed:', data);
    // Update UI with new XP, achievements, etc.
  } catch (error) {
    console.error('Failed to complete session:', error);
  }
};
```

### 6. Migration Checklist

Replace these services/utilities:

- ✅ Replace `geminiService.ts` → Use `aiAPI`
- ✅ Replace `personalizationService.ts` → Use `sessionAPI` and `aiAPI`
- ✅ Replace `notificationService.ts` → Use WebSocket `socketService`
- ✅ Replace localStorage for user data → Use `userAPI`
- ✅ Replace mock data → Use backend APIs

### 7. Authentication Flow

```typescript
// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await authAPI.login({ email, password });
    
    // Store tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // Store user
    setUserProfile(data.data.user);
    
    // Connect WebSocket
    socketService.connect(data.data.accessToken);
    
    setView('dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Register
const handleRegister = async (userData: any) => {
  try {
    const { data } = await authAPI.register(userData);
    
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    setUserProfile(data.data.user);
    socketService.connect(data.data.accessToken);
    
    setView('setup');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Logout
const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await authAPI.logout(refreshToken);
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    socketService.disconnect();
    
    setUserProfile(null);
    setView('landing');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Testing the Integration

### 1. Start Backend
```powershell
cd backend
npm run dev
```

### 2. Start Frontend
```powershell
cd ..
npm run dev
```

### 3. Test Features
- Register a new account
- Complete a session
- Check XP and level updates
- Join a program
- Create journal entries
- Post to community

## Benefits of Backend Integration

✅ **Data Persistence**: All data saved to PostgreSQL
✅ **Real Users**: Actual authentication and user management
✅ **Scalability**: Can handle multiple users
✅ **Real-time Updates**: WebSocket notifications
✅ **AI Features**: Gemini AI integration for personalization
✅ **Production Ready**: Security, validation, error handling
✅ **Analytics**: Track user behavior and progress
✅ **Community**: Real social features

## Next Steps

1. **Remove Mock Services**: Delete old mock service files
2. **Add Error Handling**: Display user-friendly error messages
3. **Add Loading States**: Show spinners during API calls
4. **Implement Caching**: Cache data in frontend for better UX
5. **Add Offline Support**: Use Service Workers for offline mode
6. **Deploy**: Deploy both frontend and backend

## Deployment Recommendations

### Frontend
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **AWS S3 + CloudFront**

### Backend
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier available
- **AWS ECS/EKS**: For production scale
- **DigitalOcean App Platform**

## Environment Variables in Production

Frontend `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_WS_URL=https://api.yourdomain.com
```

Backend production `.env`:
```env
NODE_ENV=production
DATABASE_URL=<production-db>
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<strong-secret>
```

---

🎉 **Your KAYA app is now full-stack!**
