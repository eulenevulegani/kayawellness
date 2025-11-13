# KAYA Authentication & Splash Screen Flow - REFINED

## Overview
The splash screen now appears consistently during ALL loading states, providing a beautiful branded experience instead of generic loaders.

---

## Complete User Flow

### 🔹 **New User Flow**
```
Landing Page → Auth Screen → Setup → [SPLASH] → Setup Complete → Dashboard
```

1. **Landing Page** (`view: 'landing'`)
   - First touch point for unauthenticated users
   - Modern, minimal design with particle animations
   - CTA leads to Auth Screen

2. **Auth Screen** (`view: 'auth'`)
   - Email/password authentication via Supabase
   - Creates user account
   - Calls `handleAuthSuccess()` → sets user, view to 'setup'

3. **Setup** (`view: 'setup'`)
   - Collects user preferences (name, goals, experience level)
   - Calls `handleSetupComplete()` → saves profile, sets `showSplash = true`

4. **🌟 Splash Screen** (`showSplash = true`)
   - Beautiful branded loading screen with:
     - Animated particles (20 particles)
     - Universe orb with "KAYA" text
     - Random affirmation
     - Auto-completes after 2 seconds
   - Calls `handleSplashComplete()` → navigates to 'setupComplete'

5. **Setup Complete** (`view: 'setupComplete'`)
   - Confirmation screen
   - "Begin your journey" CTA → Dashboard

6. **Dashboard** (`view: 'dashboard'`)
   - Main app interface

---

### 🔹 **Returning User Flow**
```
[SPLASH during auth] → [SPLASH during data load] → Dashboard
```

1. **App Mount** (`isLoading = true`)
   - 🌟 **SPLASH SCREEN SHOWS** during authentication check
   - `checkAuth()` runs:
     - Checks Supabase authentication
     - Fetches user profile
     - Sets `isAuthenticated = true`
     - Sets `view = 'dashboard'` (or 'setup' if no name)
     - Sets `isLoading = false`

2. **Data Loading** (`isLoadingData = true`)
   - 🌟 **SPLASH SCREEN CONTINUES** during data fetch
   - `loadUserData()` runs:
     - Fetches session history
     - Fetches achievements
     - Fetches gratitude entries
     - Sets `isLoadingData = false`

3. **Splash Complete**
   - After 2 seconds, `handleSplashComplete()` called
   - Clears all loading states
   - User lands on Dashboard (view already set)

---

### 🔹 **Unauthenticated User on Landing**
```
Landing Page → (stays on landing)
```

- No loading states triggered
- Landing page remains visible
- User can browse and click "Get Started" → Auth Screen

---

## Technical Implementation

### State Variables
```typescript
const [isLoading, setIsLoading] = useState(true);        // Initial auth check
const [isLoadingData, setIsLoadingData] = useState(false); // User data fetch
const [showSplash, setShowSplash] = useState(false);     // Post-setup splash
```

### Splash Screen Rendering Logic
```typescript
// Show splash screen for:
// 1. Initial authentication check (isLoading)
// 2. Loading user data after authentication (isLoadingData)
// 3. After completing account setup (showSplash)
if (isLoading || isLoadingData || showSplash) {
  return <SplashScreen onComplete={handleSplashComplete} />;
}
```

### Key Functions

#### `handleSplashComplete()`
```typescript
const handleSplashComplete = () => {
  setShowSplash(false);
  setIsLoading(false);
  setIsLoadingData(false);
  
  // Navigate to setupComplete only after new account creation
  if (showSplash && userProfile?.name) {
    setView('setupComplete');
  }
  // Otherwise keep current view (dashboard for returning users)
};
```

#### `checkAuth()` - On App Mount
```typescript
useEffect(() => {
  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    
    if (isAuth) {
      const profile = await userService.getProfile();
      setUserProfile(profile);
      setIsAuthenticated(true);
      setView(profile.name ? 'dashboard' : 'setup');
    }
    
    setIsLoading(false); // Splash will complete via handleSplashComplete
  };
  
  checkAuth();
}, []);
```

#### `loadUserData()` - After Authentication
```typescript
useEffect(() => {
  const loadUserData = async () => {
    if (!isAuthenticated || !userProfile) return;
    
    setIsLoadingData(true); // Triggers splash
    
    const [history, achievements, gratitude] = await Promise.all([
      userService.getSessionHistory(),
      userService.getAchievements(),
      userService.getGratitudeEntries()
    ]);
    
    setSessionHistory(history);
    setAchievements(achievements);
    setGratitudeEntries(gratitude);
    
    setIsLoadingData(false); // Splash will complete via handleSplashComplete
  };
  
  loadUserData();
}, [isAuthenticated, userProfile]);
```

---

## Benefits of This Approach

### ✅ **Consistent Branding**
- Users ALWAYS see the beautiful KAYA splash screen during loading
- No generic `<Loader />` component used
- Brand immersion from first interaction

### ✅ **Smooth Transitions**
- 2-second minimum splash ensures smooth transitions
- No jarring instant loads
- Users get moment to breathe and see affirmations

### ✅ **Covers ALL Loading States**
1. ✅ Initial app mount (auth check)
2. ✅ Returning user data loading
3. ✅ New user post-setup
4. ✅ Any authentication transitions

### ✅ **Clean Logic**
- Single splash component handles all cases
- Clear state management with three flags
- `handleSplashComplete()` intelligently routes based on context

---

## Visual Comparison

### ❌ BEFORE (Issues)
```
New User:     Landing → Auth → Setup → ❌ Generic Loader → Dashboard
Returning:    ❌ Generic Loader → Dashboard
```

### ✅ AFTER (Refined)
```
New User:     Landing → Auth → Setup → 🌟 SPLASH → Setup Complete → Dashboard
Returning:    🌟 SPLASH (auth) → 🌟 SPLASH (data) → Dashboard
```

---

## Splash Screen Design
- **Background**: Cyan gradient (#06b6d4)
- **Particles**: 20 animated white dots
- **Center**: Universe orb (XL) with "KAYA" text
- **Affirmation**: Random wellness phrase
- **Loading**: 3 pulsing dots
- **Duration**: 2 seconds minimum, auto-completes

---

## Testing Checklist

- [ ] New user creates account → sees splash after setup
- [ ] Returning user logs in → sees splash during auth + data load
- [ ] Unauthenticated user on landing → no splash
- [ ] Splash auto-completes after 2 seconds
- [ ] Splash routes correctly (setupComplete vs dashboard)
- [ ] No infinite splash loops
- [ ] No jarring transitions
- [ ] Affirmations display correctly
- [ ] Particle animations perform smoothly

---

**Status**: ✅ Implementation Complete
**Last Updated**: November 12, 2025
