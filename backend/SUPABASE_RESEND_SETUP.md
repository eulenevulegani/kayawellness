# Supabase & Resend Setup Guide

This guide will help you set up Supabase as your database and Resend for email notifications.

## 🗄️ Supabase Setup

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

### 2. Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in:
   - **Name**: kaya-production (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### 3. Get Your Database Connection Strings

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Select **"URI"** tab
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
5. Also copy the **Direct connection** string (for migrations):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

### 4. Configure Environment Variables

Create/edit `backend/.env`:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Important**: Replace:
- `[PROJECT-REF]` with your actual project reference
- `[YOUR-PASSWORD]` with your database password
- `[REGION]` with your region (e.g., us-east-1)

### 5. Run Migrations

```powershell
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

This will create all tables in your Supabase database.

### 6. (Optional) Seed Sample Data

```powershell
npm run prisma:seed
```

### 7. View Your Database

**Option 1: Supabase Dashboard**
- Go to your Supabase project
- Click "Table Editor" in sidebar
- You'll see all your tables!

**Option 2: Prisma Studio**
```powershell
npm run prisma:studio
```
Visit http://localhost:5555

## 📧 Resend Setup

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Start Building"
3. Sign up with GitHub or email

### 2. Verify Your Domain (Recommended for Production)

**Option A: Use Your Own Domain**

1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `miskka.com`)
4. Add the DNS records shown to your domain provider:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
5. Wait for verification (usually 5-15 minutes)

**Option B: Use Resend's Test Domain (Development Only)**

For testing, you can use `onboarding@resend.dev` which has a limit of 100 emails/day.

### 3. Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Name it: "KAYA Production" (or similar)
4. Select permissions: **Sending access** (default)
5. Click "Add"
6. **Copy the API key** (you won't see it again!)

### 4. Configure Environment Variables

Add to your `backend/.env`:

```env
# Resend Email
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=KAYA <noreply@yourdomain.com>
```

**Important**: 
- Replace `re_your_actual_api_key_here` with your actual Resend API key
- For `EMAIL_FROM`, use:
  - Development: `KAYA <onboarding@resend.dev>`
  - Production: `KAYA <noreply@yourdomain.com>` (after domain verification)

### 5. Test Email Sending

```powershell
# Start the backend
cd backend
npm run dev
```

Then test registration:
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

Check your email for the verification email!

## 🔧 Configuration Summary

Your final `backend/.env` should look like:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Supabase Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Redis (optional, can use Supabase Redis or Upstash)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Gemini AI
GEMINI_API_KEY=AIzaSyBSXY0kYO8NMciQXazQcJQiCd-iFrpm15E

# Resend Email
RESEND_API_KEY=re_your_actual_api_key
EMAIL_FROM=KAYA <noreply@yourdomain.com>

# Frontend
FRONTEND_URL=http://localhost:5173

# Other settings...
```

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database connection strings copied
- [ ] Environment variables configured
- [ ] Prisma migrations run successfully
- [ ] Tables visible in Supabase dashboard
- [ ] Resend account created
- [ ] Domain verified (production) or using test domain (dev)
- [ ] Resend API key obtained
- [ ] Email configuration added to .env
- [ ] Test email sent successfully

## 🚀 Benefits of Supabase & Resend

### Supabase Benefits:
✅ Free tier with 500MB database
✅ Automatic backups
✅ Built-in authentication (optional, we're using custom)
✅ Real-time subscriptions available
✅ PostgreSQL database (production-ready)
✅ Auto-scaling
✅ Dashboard for database management
✅ 2GB bandwidth free tier

### Resend Benefits:
✅ Free tier: 3,000 emails/month
✅ 100 emails/day with test domain
✅ Modern API (much simpler than SMTP)
✅ Email analytics
✅ Webhook support
✅ High deliverability
✅ React Email support
✅ No credit card required for free tier

## 💰 Pricing

### Supabase Free Tier:
- 500 MB database space
- 5 GB bandwidth
- 2 GB file storage
- 50,000 monthly active users
- **Perfect for starting out!**

### Resend Free Tier:
- 3,000 emails per month
- 100 emails per day
- All features included
- **Great for development and small scale!**

## 🔄 Alternative: Redis with Upstash

If you need Redis for production, use Upstash (works great with Supabase):

1. Go to [upstash.com](https://upstash.com)
2. Create free Redis database
3. Copy connection details
4. Update `.env`:
   ```env
   REDIS_HOST=your-upstash-host.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-upstash-password
   ```

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: "Connection timeout"
- Check your connection strings are correct
- Ensure you're using the pooler URL (port 6543) for DATABASE_URL
- Verify your IP is allowed (Supabase allows all by default)

**Error**: "Password authentication failed"
- Double-check your password in the connection string
- Make sure password is URL-encoded if it contains special characters

### Email Sending Errors

**Error**: "Invalid API key"
- Verify you copied the full API key starting with `re_`
- Check for extra spaces in `.env` file
- Regenerate API key if needed

**Error**: "Domain not verified"
- Use `onboarding@resend.dev` for testing
- Or wait for domain verification to complete
- Check DNS records are properly configured

### Prisma Migration Errors

**Error**: "Can't reach database server"
- Check DATABASE_URL is correct
- Ensure Supabase project is active
- Try using DIRECT_URL for migrations

**Solution**: Use direct connection for migrations:
```powershell
# Temporarily set DATABASE_URL to DIRECT_URL
$env:DATABASE_URL="postgresql://postgres.[REF]:[PWD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
npm run prisma:migrate
```

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Resend with Node.js](https://resend.com/docs/send-with-nodejs)

## 🎉 Next Steps

After setup:
1. Test user registration
2. Verify email delivery
3. Check data in Supabase dashboard
4. Deploy your backend to production
5. Update frontend to connect to deployed backend

---

**You're all set!** Your KAYA backend now uses:
- 🗄️ **Supabase** for PostgreSQL database
- 📧 **Resend** for email delivery
- 🚀 Production-ready infrastructure
