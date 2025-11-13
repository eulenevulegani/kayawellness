# KAYA Backend - Quick Reference

## 🚀 Start Backend

### Docker (Easiest)
```powershell
cd backend
docker-compose up -d
docker-compose exec api npm run prisma:migrate
docker-compose exec api npm run prisma:seed
```

### Local Development
```powershell
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 🔑 Essential Commands

```powershell
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (GUI)
npm run prisma:studio

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View logs
Get-Content logs/all.log -Tail 50 -Wait
```

## 📋 API Quick Reference

Base URL: `http://localhost:5000/api/v1`

### Register User
```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```

### Login
```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### Get Profile (with token)
```powershell
curl http://localhost:5000/api/v1/users/me `
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Programs
```powershell
curl http://localhost:5000/api/v1/programs
```

### Create Session
```powershell
curl -X POST http://localhost:5000/api/v1/sessions `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"activityType":"MEDITATION","title":"Morning Calm","durationMinutes":10}'
```

## 🔧 Environment Variables

Required in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/kaya
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
```

## 📊 Database Quick Access

```powershell
# Open Prisma Studio
npm run prisma:studio
# Visit: http://localhost:5555

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your-migration-name
```

## 🐛 Troubleshooting

### Port 5000 in use
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database connection error
```powershell
# Check PostgreSQL status
sc query postgresql-x64-16

# Start PostgreSQL
net start postgresql-x64-16
```

### Prisma errors
```powershell
npm run prisma:generate
npx prisma db push
```

### Redis connection error
```powershell
# Start Redis (if installed)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

## 📦 Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api

# Restart API
docker-compose restart api

# Execute command in container
docker-compose exec api npm run prisma:migrate

# Remove all containers and volumes
docker-compose down -v
```

## 🧪 Testing Endpoints

### Health Check
```powershell
curl http://localhost:5000/health
```

### Test Full Flow
```powershell
# 1. Register
$register = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"Test123!","name":"Test"}'

# 2. Get token
$token = $register.data.accessToken

# 3. Get profile
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me" `
  -Headers @{Authorization = "Bearer $token"}

# 4. Get programs
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/programs"
```

## 📁 Key Files

- `src/server.ts` - Main application
- `src/config/database.ts` - Database connection
- `src/routes/*.routes.ts` - API routes
- `src/services/*.service.ts` - Business logic
- `prisma/schema.prisma` - Database schema
- `.env` - Environment config

## 🌐 URLs

- API: http://localhost:5000
- Health: http://localhost:5000/health
- Prisma Studio: http://localhost:5555 (when running)
- Base API: http://localhost:5000/api/v1

## 💾 Backup & Restore

### Backup Database
```powershell
pg_dump -U postgres kaya > backup.sql
```

### Restore Database
```powershell
psql -U postgres kaya < backup.sql
```

## 🔐 Security Checklist

- ✅ Change JWT_SECRET in production
- ✅ Use strong DATABASE_URL password
- ✅ Set NODE_ENV=production
- ✅ Configure CORS for your domain
- ✅ Enable HTTPS in production
- ✅ Set secure SESSION_SECRET
- ✅ Configure proper FRONTEND_URL

## 📈 Monitoring

### Check Server Status
```powershell
curl http://localhost:5000/health
```

### View Logs
```powershell
Get-Content logs/all.log -Tail 50 -Wait
Get-Content logs/error.log -Tail 50 -Wait
```

### Database Stats
```powershell
npm run prisma:studio
```

## 🚀 Production Deployment

1. Build: `npm run build`
2. Set environment variables
3. Run migrations: `npm run prisma:migrate`
4. Start: `npm start`
5. Use PM2: `pm2 start dist/server.js`

## 📚 Documentation

- Full docs: `backend/README.md`
- Setup guide: `backend/SETUP_GUIDE.md`
- Integration: `FRONTEND_INTEGRATION.md`
- Overview: `BACKEND_OVERVIEW.md`

---

## 🎯 Common Tasks

### Add New Endpoint
1. Create route in `src/routes/`
2. Add controller logic
3. Add service if needed
4. Update this reference

### Add Database Model
1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update seed file if needed

### Debug API Issue
1. Check logs: `Get-Content logs/error.log -Tail 50`
2. Test endpoint with curl
3. Check database in Prisma Studio
4. Verify auth token

---

**Quick Help**: See `backend/SETUP_GUIDE.md` for detailed instructions.
