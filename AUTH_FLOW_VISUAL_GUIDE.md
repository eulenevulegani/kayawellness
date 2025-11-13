# KAYA Authentication Flow - Visual Guide

## 🌟 Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                             │
│  🌌 "Your Calm Universe" - Hero Section                        │
│                                                                 │
│  [Start Free Trial]  or  [Log In]                             │
└─────────────────────┬──────────────────┬────────────────────────┘
                      │                  │
        New User ─────┘                  └───── Returning User
                      │                             │
                      ▼                             ▼
    ┌─────────────────────────────┐   ┌──────────────────────────┐
    │   9-STEP ONBOARDING SETUP   │   │    AUTH SCREEN (LOGIN)   │
    │   ☀️ You Are The Sun        │   │                          │
    └─────────────────┬───────────┘   │  Email: [________]       │
                      │                │  Password: [________]    │
         Step 1: 🌌 Welcome           │                          │
         Step 2: ⭐ Goals             │  [Login]                 │
         Step 3: 🪐 Experience        │                          │
         Step 4: 🌍 Demographics      │  "Create Your Universe"  │
         Step 5: ☄️ Rhythm            │  (redirects to Setup)    │
         Step 6: 🎵 Voice             └───────────┬──────────────┘
         Step 7: 🌟 Check-ins                     │
         Step 8: 🌞 Schedule                      │
         Step 9: ☀️ YOU (center!)                 │
                  - Name                          │
                  - Email                         │
                  - Password                      │
                      │                           │
                      ▼                           │
    ┌─────────────────────────────┐              │
    │  SIGNUP (Backend Call)      │              │
    │  Creates Supabase account   │              │
    │  Sends verification email   │              │
    └─────────────────┬───────────┘              │
                      │                           │
                      ▼                           │
    ┌─────────────────────────────┐              │
    │  VERIFICATION SCREEN        │              │
    │  ✉️ Email sent to user      │              │
    │                             │              │
    │  Enter 6-digit code:        │              │
    │  [_] [_] [_] [_] [_] [_]   │              │
    │                             │              │
    │  [Verify & Enter KAYA]      │              │
    │  [Resend Code]              │              │
    └─────────────────┬───────────┘              │
                      │                           │
                      ▼                           │
    ┌─────────────────────────────┐              │
    │  VERIFY EMAIL (Backend)     │              │
    │  Validates OTP code         │              │
    │  Creates session            │              │
    │  Saves profile to DB        │              │
    └─────────────────┬───────────┘              │
                      │                           │
                      ▼                           │
    ┌─────────────────────────────┐              │
    │  SPLASH SCREEN              │ ◄────────────┘
    │  🌟 Animated universe       │   (after login)
    │  "Welcome to KAYA"          │
    └─────────────────┬───────────┘
                      │
                      ▼
    ┌─────────────────────────────┐
    │  SETUP COMPLETE SCREEN      │
    │  (New users only)           │
    │  "Your universe awaits!"    │
    └─────────────────┬───────────┘
                      │
                      ▼
    ┌─────────────────────────────┐
    │     DASHBOARD (HOME)        │
    │  🏠 Journey                 │
    │  📚 Explore                 │
    │  ✍️ Journal                 │
    │  🌌 Universe                │
    └─────────────────────────────┘
```

## 🔑 Key Components

### 1. Landing Page (`LandingPage.tsx`)
- Entry point for all users
- "Start Free Trial" → Setup (new users)
- "Log In" → Auth Screen (existing users)

### 2. Setup Component (`Setup.tsx`)
- 9 progressive steps
- Collects all user preferences
- Final step (9) = user credentials
- Returns profile + password to App

### 3. Auth Screen (`AuthScreen.tsx`)
- Login-only interface
- Simplified from previous version
- "Create Your Universe" redirects to Setup

### 4. Verification Screen (`VerificationScreen.tsx`)
- Beautiful 6-digit OTP input
- Auto-focus and keyboard navigation
- Paste support
- Resend functionality
- Error handling

### 5. Auth Service (`auth.service.ts`)
```typescript
// New Methods:
- signup() → { needsVerification: true, email }
- verifyEmail(email, code) → UserProfile
- resendVerificationEmail(email) → void
```

## 🎯 State Flow in App.tsx

```typescript
// Onboarding Flow States
pendingVerificationEmail: string        // Email waiting for verification
pendingSetupProfile: UserProfile | null // Profile to save after verification

// Process:
1. User completes Setup → calls handleSetupComplete(profile, password)
2. handleSetupComplete calls authService.signup()
3. Sets pendingVerificationEmail & pendingSetupProfile
4. Navigates to 'auth' view
5. Auth view detects pendingVerificationEmail
6. Shows VerificationScreen instead of AuthScreen
7. User enters code → calls authService.verifyEmail()
8. Calls handleEmailVerified() to save profile
9. Shows splash screen
10. Navigates to setupComplete → dashboard
```

## 🎨 Visual Highlights

### Step 9 - The Sun ☀️
```
┌─────────────────────────────────────┐
│                                     │
│         🌞 (Large Sun Icon)         │
│      Golden gradient background     │
│                                     │
│     "You Are The Sun"               │
│  ☀️ The Center of Your Universe     │
│                                     │
│  You've journeyed through 8         │
│  celestial realms. Now place        │
│  yourself at the center—radiant,    │
│  powerful, and complete.            │
│                                     │
│  Name:     [______________]         │
│  Email:    [______________]         │
│  Password: [______________]         │
│                                     │
│  [☀️ Illuminate Your Universe]      │
│     (Golden gradient button)        │
└─────────────────────────────────────┘
```

### Verification Screen
```
┌─────────────────────────────────────┐
│         🌟 KAYA Logo                │
│                                     │
│     Verify Your Email               │
│                                     │
│  We sent a 6-digit code to          │
│  user@example.com                   │
│                                     │
│  [_] [_] [_] [_] [_] [_]           │
│   ↑ Auto-focus, paste support       │
│                                     │
│  [Verify & Enter KAYA]              │
│                                     │
│  Didn't receive the code?           │
│  [Resend Code]                      │
│                                     │
│  💡 Check spam folder               │
└─────────────────────────────────────┘
```

## 🔐 Security Features

✅ **Email Verification Required** - No unverified accounts
✅ **Supabase OTP** - Industry-standard verification
✅ **Password Requirements** - Minimum 8 characters
✅ **Session Management** - Proper auth state handling
✅ **Secure Token Storage** - Handled by Supabase
✅ **Rate Limiting** - Built into Supabase auth

## 🚀 Benefits

### For Users:
- ✨ Beautiful, meaningful onboarding experience
- 🎯 Clear progress tracking (9 steps)
- 🔒 Secure account creation
- 📧 Email confirmation for peace of mind
- 🌌 Thematic journey (you = the sun!)

### For Platform:
- ✅ Valid email addresses only
- ✅ Reduced spam/fake accounts
- ✅ Better user data quality
- ✅ Improved security posture
- ✅ Professional user experience

## 📝 Testing Checklist

- [ ] Complete all 9 onboarding steps
- [ ] Receive verification email
- [ ] Enter correct 6-digit code
- [ ] Successfully create account
- [ ] See splash screen
- [ ] Land on dashboard
- [ ] Try resending code
- [ ] Test invalid code error
- [ ] Test expired code handling
- [ ] Login with created account
- [ ] Logout and login again

---

**Implementation Complete! ✨**

The KAYA onboarding experience now guides users through 9 celestial steps, with them as the radiant sun at the center, followed by secure email verification before entering their wellness universe.
