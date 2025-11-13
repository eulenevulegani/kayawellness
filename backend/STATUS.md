# Backend Status

## Currently NOT Running

The KAYA app is currently using **Supabase directly** for:
- ✅ User authentication (signup, login, logout)
- ✅ User profile setup and storage
- ✅ Session persistence

## Features That Would Need Backend API

The following features have endpoints defined but are not yet migrated to Supabase:
- Session history tracking
- Achievements system
- Gratitude journal entries
- XP and leveling system
- Streak tracking
- Program enrollment and progress
- Community challenges
- Support groups

## To Start Backend (if needed later)

```powershell
cd backend
npm install
npm run dev
```

Then uncomment in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

## Migration Path

When ready to fully migrate, either:
1. Migrate remaining features to Supabase (recommended for simplicity)
2. Start the backend and integrate it alongside Supabase
