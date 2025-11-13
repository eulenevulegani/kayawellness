# Backend Integration Implementation Guide

## ✅ Completed Tasks

### 1. API Client Layer
**Created:** `services/api.client.ts`
- ✅ Axios instance with baseURL configuration
- ✅ Request interceptor for auth token injection
- ✅ Response interceptor for error handling
- ✅ Automatic token refresh on 401 errors
- ✅ Error helper function for consistent error messages

### 2. Authentication Service
**Created:** `services/auth.service.ts`
- ✅ Login/Signup/Logout functions
- ✅ Token management (store/retrieve/clear)
- ✅ Session persistence
- ✅ Email verification support
- ✅ Password reset functionality
- ✅ Token refresh logic

### 3. User Service
**Created:** `services/user.service.ts`
- ✅ Profile CRUD operations
- ✅ Session history management
- ✅ Achievements tracking
- ✅ Gratitude entries
- ✅ XP and streak updates
- ✅ Program management
- ✅ Challenge/group joining

### 4. Gemini API Integration
**Updated:** `services/geminiService.ts`
- ✅ Real Gemini AI integration using @google/genai
- ✅ Fallback to backend AI endpoints if no client key
- ✅ Context-aware chat with AI
- ✅ Personalized session generation
- ✅ Sleep story generation
- ✅ Journal prompts and insights
- ✅ Content fetching (meditations, breathwork, soundscapes)
- ✅ Graceful fallbacks for all functions

### 5. Authentication UI
**Created:** `components/AuthScreen.tsx`
- ✅ Login/Signup toggle
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design matching app theme

### 6. Environment Configuration
**Created:** `.env.local`, `.env.local.example`, `vite-env.d.ts`
- ✅ API URL configuration
- ✅ Gemini API key support
- ✅ TypeScript environment types
- ✅ Example file for easy setup

### 7. Dependencies
**Updated:** `package.json`
- ✅ Added axios for HTTP client
- ✅ Installed successfully

---

## 🔄 Next Steps: App.tsx Integration

### Phase 1: Add Authentication Check

Update `App.tsx` to check authentication status:

```typescript
import { useState, useEffect } from 'react';
import authService from './services/auth.service';
import userService from './services/user.service';
import AuthScreen from './components/AuthScreen';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Fetch user profile from backend
          const profile = await userService.getProfile();
          setUserProfile(profile);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear auth
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setUserProfile(user);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Rest of your app...
}
```

### Phase 2: Replace localStorage with API Calls

#### Current State:
```typescript
const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('kaya-profile-v3-premium', {...});
const [sessionHistory, setSessionHistory] = useLocalStorage<SessionHistoryEntry[]>('kaya-history', []);
const [achievements, setAchievements] = useLocalStorage<Achievement[]>('kaya-achievements', []);
```

#### New State:
```typescript
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
const [achievements, setAchievements] = useState<Achievement[]>([]);
const [isLoadingData, setIsLoadingData] = useState(true);

// Load data on auth
useEffect(() => {
  const loadUserData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingData(true);
    try {
      const [profile, history, achievementList] = await Promise.all([
        userService.getProfile(),
        userService.getSessionHistory(),
        userService.getAchievements()
      ]);
      
      setUserProfile(profile);
      setSessionHistory(history);
      setAchievements(achievementList);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Show error to user
    } finally {
      setIsLoadingData(false);
    }
  };
  
  loadUserData();
}, [isAuthenticated]);
```

### Phase 3: Update Data Mutation Functions

#### Session Completion:
```typescript
// OLD
const handleSessionComplete = (mood: string, reflection: string) => {
  const newSession = { date: new Date().toISOString(), mood, reflection };
  setSessionHistory([...sessionHistory, newSession]);
  handleAddXp(XP_CONFIG.session);
};

// NEW
const handleSessionComplete = async (mood: string, reflection: string) => {
  try {
    const newSession = await userService.addSession({
      date: new Date().toISOString(),
      mood,
      reflection
    });
    
    setSessionHistory([...sessionHistory, newSession]);
    
    // XP is updated on backend, fetch new profile
    const updatedProfile = await userService.addXP(XP_CONFIG.session, 'session_complete');
    setUserProfile(updatedProfile);
  } catch (error) {
    console.error('Failed to save session:', error);
    // Show error notification
  }
};
```

#### Achievement Addition:
```typescript
// NEW
const handleAddAchievement = async (title: string, description: string) => {
  try {
    const newAchievement = await userService.addAchievement({
      title,
      description,
      date: new Date().toISOString()
    });
    
    setAchievements([...achievements, newAchievement]);
  } catch (error) {
    console.error('Failed to save achievement:', error);
  }
};
```

#### Profile Updates:
```typescript
// NEW
const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
  try {
    const updatedProfile = await userService.updateProfile(updates);
    setUserProfile(updatedProfile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};
```

---

## 🔧 Backend Requirements

For the frontend to work, your backend needs these endpoints:

### Authentication Endpoints:
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Endpoints:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/setup` - Complete onboarding
- `GET /api/users/sessions` - Get session history
- `POST /api/users/sessions` - Add new session
- `GET /api/users/achievements` - Get achievements
- `POST /api/users/achievements` - Add achievement
- `GET /api/users/gratitude` - Get gratitude entries
- `POST /api/users/gratitude` - Add gratitude entry
- `POST /api/users/xp` - Add XP points
- `POST /api/users/streak` - Update streak
- `POST /api/users/programs/start` - Start program
- `POST /api/users/programs/complete-day` - Complete program day
- `POST /api/users/challenges/join` - Join challenge
- `POST /api/users/groups/join` - Join support group

### AI Endpoints (Optional - if not using client-side Gemini):
- `POST /api/ai/chat` - Generate chat response
- `POST /api/ai/generate-session` - Generate personalized session
- `POST /api/ai/sleep-story` - Generate sleep story
- `POST /api/ai/journal-prompts` - Generate journal prompts
- `POST /api/ai/journal-followup` - Generate follow-up prompt
- `POST /api/ai/weekly-insight` - Generate weekly insight
- `POST /api/ai/achievement` - Generate achievement

### Content Endpoints:
- `GET /api/content/meditations?mood=` - Get meditations for mood
- `GET /api/content/breathwork?mood=` - Get breathwork for mood
- `GET /api/content/soundscapes?mood=` - Get soundscapes for mood

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd c:\Users\vuleg\Desktop\KAYA
npm install
```

### 2. Configure Environment
```bash
# Copy example file
copy .env.local.example .env.local

# Edit .env.local and add:
# - VITE_API_URL (your backend URL)
# - VITE_GEMINI_API_KEY (from https://makersuite.google.com/app/apikey)
```

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Should start on http://localhost:3000
```

### 4. Start Frontend
```bash
npm run dev
# Should start on http://localhost:3000 (or different port if backend uses 3000)
```

### 5. Test Authentication
1. Open app in browser
2. You should see AuthScreen
3. Try signing up with email/password
4. If backend is running, you'll be authenticated
5. If backend is NOT running, you'll see error messages

---

## 🎯 Testing Checklist

### Authentication Flow:
- [ ] Sign up creates new user
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Token is stored in localStorage
- [ ] Token is sent with API requests
- [ ] Logout clears token
- [ ] Expired token redirects to login

### Data Persistence:
- [ ] Profile changes save to backend
- [ ] Session history persists across page refresh
- [ ] Achievements are stored in database
- [ ] Gratitude entries sync with backend
- [ ] XP and streak update correctly
- [ ] Program progress saves

### AI Integration:
- [ ] Chat generates contextual responses
- [ ] Sessions are personalized
- [ ] Sleep stories are unique
- [ ] Journal prompts are relevant
- [ ] Content fetching works for all moods

### Error Handling:
- [ ] Network errors show user-friendly messages
- [ ] 401 errors trigger logout
- [ ] Form validation works
- [ ] Loading states display correctly
- [ ] Fallbacks work when API fails

---

## 🐛 Troubleshooting

### "Cannot find module 'axios'"
**Solution:** Run `npm install` in project root

### "Property 'env' does not exist on type 'ImportMeta'"
**Solution:** Ensure `vite-env.d.ts` is in project root with proper types

### "Network Error" or "CORS Error"
**Solution:** 
1. Check backend is running
2. Verify VITE_API_URL in .env.local
3. Ensure backend has CORS enabled for your frontend URL

### "401 Unauthorized" on all requests
**Solution:**
1. Check if token is being sent (Network tab > Headers)
2. Verify JWT secret matches between frontend/backend
3. Check token expiration time

### Gemini API not working
**Solution:**
1. Verify VITE_GEMINI_API_KEY is set correctly
2. Check API key is valid on makersuite.google.com
3. Ensure billing is enabled on Google Cloud
4. Check browser console for specific error messages

### Backend endpoints 404
**Solution:**
1. Verify backend routes are registered
2. Check API_BASE_URL doesn't have double slashes
3. Ensure endpoint paths match exactly

---

## 📦 File Structure

```
KAYA/
├── services/
│   ├── api.client.ts       # NEW: Axios HTTP client
│   ├── auth.service.ts     # NEW: Authentication logic
│   ├── user.service.ts     # NEW: User data management
│   ├── geminiService.ts    # UPDATED: Real AI integration
│   ├── contextService.ts   # Existing context awareness
│   └── notificationService.ts
├── components/
│   ├── AuthScreen.tsx      # NEW: Login/Signup UI
│   └── ... (existing components)
├── .env.local              # NEW: Environment config
├── .env.local.example      # NEW: Example config
├── vite-env.d.ts          # NEW: TypeScript env types
└── package.json           # UPDATED: Added axios

backend/                    # Your existing backend
└── (needs to be running)
```

---

## 🎉 Success Criteria

You've successfully integrated when:

1. ✅ Users can sign up and login
2. ✅ Authentication persists across page refresh
3. ✅ All user data saves to backend database
4. ✅ Sessions generate using real AI
5. ✅ No data is stored in localStorage (except auth token)
6. ✅ Error messages are user-friendly
7. ✅ Loading states show during API calls
8. ✅ App works offline with graceful degradation

---

## 📝 Migration Notes

### Data Migration from localStorage

If you have users with existing localStorage data, create a migration:

```typescript
// utils/migrator.ts
export async function migrateLocalStorageData() {
  const oldProfile = localStorage.getItem('kaya-profile-v3-premium');
  const oldHistory = localStorage.getItem('kaya-history');
  const oldAchievements = localStorage.getItem('kaya-achievements');
  
  if (!oldProfile) return; // No data to migrate
  
  try {
    const profile = JSON.parse(oldProfile);
    const history = JSON.parse(oldHistory || '[]');
    const achievements = JSON.parse(oldAchievements || '[]');
    
    // Send to backend
    await userService.updateProfile(profile);
    
    for (const session of history) {
      await userService.addSession(session);
    }
    
    for (const achievement of achievements) {
      await userService.addAchievement(achievement);
    }
    
    // Clear old data
    localStorage.removeItem('kaya-profile-v3-premium');
    localStorage.removeItem('kaya-history');
    localStorage.removeItem('kaya-achievements');
    
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

---

## 🔗 Additional Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [React Query (recommended for state management)](https://tanstack.com/query/latest)

---

**Implementation Status:** ✅ Core infrastructure complete
**Next Task:** Update App.tsx to use new services
**Estimated Time:** 2-3 hours for full App.tsx integration
