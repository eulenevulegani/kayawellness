# KAYA Backend Setup Guide

This guide will help you set up and run the production-ready KAYA backend.

## Quick Start (5 minutes)

### Option 1: Docker (Recommended)

1. **Prerequisites**: Install Docker and Docker Compose

2. **Copy environment file**:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

3. **Edit `.env`** and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your-actual-api-key
   ```

4. **Start all services**:
   ```powershell
   docker-compose up -d
   ```

5. **Run migrations and seed**:
   ```powershell
   docker-compose exec api npm run prisma:migrate
   docker-compose exec api npm run prisma:seed
   ```

6. **API is ready!** 
   - API: http://localhost:5000
   - Health check: http://localhost:5000/health

### Option 2: Local Development

1. **Prerequisites**:
   - Node.js 20+
   - PostgreSQL 16+
   - Redis 7+

2. **Install PostgreSQL** (if not installed):
   ```powershell
   # Using Chocolatey
   choco install postgresql
   
   # Or download from: https://www.postgresql.org/download/windows/
   ```

3. **Install Redis** (if not installed):
   ```powershell
   # Using Chocolatey
   choco install redis-64
   
   # Or use WSL/Docker
   ```

4. **Create database**:
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE kaya;
   \q
   ```

5. **Install dependencies**:
   ```powershell
   cd backend
   npm install
   ```

6. **Configure environment**:
   ```powershell
   Copy-Item .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/kaya?schema=public"
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key
   ```

7. **Set up database**:
   ```powershell
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

8. **Start the server**:
   ```powershell
   npm run dev
   ```

9. **API is ready!**
   - API: http://localhost:5000
   - Health check: http://localhost:5000/health

## Testing the API

### 1. Check Health
```powershell
curl http://localhost:5000/health
```

### 2. Register a User
```powershell
$body = @{
    email = "test@example.com"
    password = "SecurePass123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### 3. Login
```powershell
$body = @{
    email = "test@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

$token = $response.data.accessToken
```

### 4. Get User Profile
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me" `
    -Method Get `
    -Headers @{Authorization = "Bearer $token"}
```

### 5. Get Wellness Programs
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/programs" `
    -Method Get
```

## Connecting Frontend to Backend

Update your frontend `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000
```

## Database Management

### View Database in Prisma Studio
```powershell
npm run prisma:studio
```
Opens at http://localhost:5555

### Create a Migration
```powershell
npm run prisma:migrate
```

### Reset Database
```powershell
npx prisma migrate reset
npm run prisma:seed
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Error
- Check PostgreSQL is running: `sc query postgresql-x64-16`
- Verify DATABASE_URL in `.env`
- Check credentials

### Redis Connection Error
- Check Redis is running
- Verify REDIS_HOST and REDIS_PORT in `.env`

### Prisma Errors
```powershell
# Regenerate Prisma client
npm run prisma:generate

# Check database connection
npx prisma db push
```

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update profile
- `GET /api/v1/users/me/stats` - Get user stats

### Sessions
- `POST /api/v1/sessions` - Create session
- `GET /api/v1/sessions` - Get user sessions
- `GET /api/v1/sessions/:id` - Get specific session
- `PATCH /api/v1/sessions/:id/complete` - Complete session
- `GET /api/v1/sessions/stats` - Get session stats

### Programs
- `GET /api/v1/programs` - Get all programs
- `GET /api/v1/programs/:id` - Get program details
- `POST /api/v1/programs/:id/enroll` - Enroll in program
- `GET /api/v1/programs/enrollments/my` - Get enrollments

### Journal
- `POST /api/v1/journal` - Create entry
- `GET /api/v1/journal` - Get entries
- `POST /api/v1/journal/gratitude` - Add gratitude
- `POST /api/v1/journal/mood` - Log mood
- `GET /api/v1/journal/mood/history` - Get mood history

### Community
- `GET /api/v1/community` - Get posts
- `POST /api/v1/community` - Create post
- `POST /api/v1/community/:id/like` - Like post
- `POST /api/v1/community/:id/comments` - Add comment

### AI
- `POST /api/v1/ai/session/generate` - Generate session
- `POST /api/v1/ai/sleep-story/generate` - Generate story
- `POST /api/v1/ai/chat` - Chat with AI
- `POST /api/v1/ai/mood/insights` - Get mood insights

### Events
- `GET /api/v1/events` - Get events
- `POST /api/v1/events/:id/register` - Register for event
- `GET /api/v1/events/my-registrations` - My registrations

### Achievements
- `GET /api/v1/achievements` - Get unlocked achievements
- `GET /api/v1/achievements/available` - Get all with progress

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard stats
- `GET /api/v1/analytics/mood-trends` - Mood trends
- `GET /api/v1/analytics/activity-breakdown` - Activity stats

## Production Deployment

### Environment Variables
Set all required variables in production:
```env
NODE_ENV=production
DATABASE_URL=<production-db-url>
JWT_SECRET=<strong-secret>
GEMINI_API_KEY=<api-key>
FRONTEND_URL=<production-frontend-url>
```

### Build and Deploy
```powershell
npm run build
npm start
```

### Using PM2 (Process Manager)
```powershell
npm install -g pm2
pm2 start dist/server.js --name kaya-api
pm2 save
pm2 startup
```

## Monitoring

### View Logs
```powershell
# All logs
Get-Content logs/all.log -Tail 50 -Wait

# Error logs only
Get-Content logs/error.log -Tail 50 -Wait

# Docker logs
docker-compose logs -f api
```

### Health Check
The `/health` endpoint returns:
- Server status
- Uptime
- Environment
- Timestamp

## Next Steps

1. ✅ Backend is running
2. 🔗 Update frontend to connect to backend
3. 🔑 Get a Gemini API key from https://ai.google.dev/
4. 📧 Configure email service (optional)
5. 💳 Set up Stripe for payments (optional)
6. 🚀 Deploy to production

## Support

- Documentation: See `README.md`
- API Reference: Check `/api/v1` endpoints
- Database Schema: See `prisma/schema.prisma`

## Common Issues

**Issue**: "Cannot find module 'express'"
**Solution**: Run `npm install`

**Issue**: "Prisma client not generated"
**Solution**: Run `npm run prisma:generate`

**Issue**: "Database connection failed"
**Solution**: Check PostgreSQL is running and DATABASE_URL is correct

**Issue**: "Redis connection error"
**Solution**: Start Redis or comment out Redis code for testing

---

🎉 **Congratulations!** Your KAYA backend is now ready for production use!
