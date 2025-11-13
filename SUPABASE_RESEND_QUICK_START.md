# KAYA Backend - Now with Supabase & Resend! 🚀

## ✅ Updated Configuration

Your backend has been configured to use:
- 🗄️ **Supabase** - PostgreSQL database (cloud-hosted)
- 📧 **Resend** - Modern email delivery service

## 📋 Quick Setup Steps

### 1. Install Dependencies
```powershell
cd backend
npm install
```

### 2. Set Up Supabase

**Create Account & Project:**
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project (choose name, password, region)
3. Wait 2-3 minutes for setup

**Get Connection Strings:**
1. In Supabase dashboard: **Settings** → **Database**
2. Copy both connection strings:
   - **Connection string** (pooler) → for DATABASE_URL
   - **Direct connection** → for DIRECT_URL

### 3. Set Up Resend

**Create Account:**
1. Go to [resend.com](https://resend.com) → Sign up
2. Go to **API Keys** → Create API Key
3. Copy the key (starts with `re_`)

**For Testing:**
- Use `EMAIL_FROM=KAYA <onboarding@resend.dev>`
- 100 emails/day limit

**For Production:**
1. **Domains** → Add Domain → Add your domain
2. Add DNS records to your domain provider
3. Wait for verification
4. Use `EMAIL_FROM=KAYA <noreply@yourdomain.com>`

### 4. Configure Environment

Create `backend/.env`:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Email - Resend
RESEND_API_KEY=re_your_actual_api_key
EMAIL_FROM=KAYA <onboarding@resend.dev>

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key

# Gemini AI
GEMINI_API_KEY=AIzaSyBSXY0kYO8NMciQXazQcJQiCd-iFrpm15E

# Frontend
FRONTEND_URL=http://localhost:5173

# Optional: Redis (use Upstash for cloud)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Run Migrations

```powershell
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 6. Start Backend

```powershell
npm run dev
```

Backend runs at: http://localhost:5000

## 🧪 Test It

### Test Registration (sends email!)
```powershell
$body = @{
    email = "your-email@example.com"
    password = "TestPass123!"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

Check your email inbox for verification email!

### View Database
1. Supabase Dashboard → **Table Editor**
2. Or: `npm run prisma:studio` → http://localhost:5555

## 📚 Detailed Documentation

See **`backend/SUPABASE_RESEND_SETUP.md`** for:
- Step-by-step Supabase setup
- Step-by-step Resend setup
- Domain verification guide
- Troubleshooting
- Pricing details
- Alternative Redis options

## 🎯 What Changed

### Files Updated:
- ✅ `package.json` - Added `resend` package, removed `nodemailer`
- ✅ `.env.example` - Updated for Supabase & Resend
- ✅ `prisma/schema.prisma` - Added directUrl for Supabase
- ✅ `src/config/index.ts` - Updated email config
- ✅ `src/services/email.service.ts` - Now uses Resend API
- ✅ `docker-compose.yml` - Removed local PostgreSQL

### Benefits:
✅ No local database needed
✅ Production-ready from day 1
✅ Automatic backups
✅ Better email deliverability
✅ Free tiers for both services
✅ Easier deployment

## 🚀 Deployment

Since you're using cloud services, deployment is simpler:

1. **Deploy backend to**:
   - Railway
   - Render
   - Vercel
   - AWS/GCP/Azure

2. **Set environment variables** on your platform

3. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

4. **Done!** No database to manage separately.

## 💡 Tips

**Free Tier Limits:**
- Supabase: 500MB database, 2GB bandwidth
- Resend: 3,000 emails/month (100/day on test domain)
- Both are very generous for starting out!

**For Redis:**
- Development: Local Redis or skip it (optional)
- Production: Use [Upstash](https://upstash.com) free tier

**Monitoring:**
- Supabase dashboard shows database metrics
- Resend dashboard shows email analytics

## 🐛 Troubleshooting

**Can't connect to database:**
- Check Supabase project is active
- Verify connection strings are correct
- Use DIRECT_URL for migrations

**Emails not sending:**
- Check RESEND_API_KEY is correct
- Use test domain for development
- Check Resend dashboard for logs

**Need help?**
See `backend/SUPABASE_RESEND_SETUP.md` for detailed troubleshooting!

---

## Next Steps

1. ✅ Backend configured for Supabase & Resend
2. 📝 Follow setup steps above
3. 🧪 Test registration and email
4. 🎨 Connect frontend
5. 🚀 Deploy to production

**Everything is ready to go!** 🎉
