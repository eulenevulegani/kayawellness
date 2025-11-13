# Account Creation Test Instructions

## What Was Fixed

1. **Added better debugging** - More console logs to track the signup flow
2. **Added auth state listener** - Detects when user clicks email verification link
3. **Updated verification screen** - Shows instructions for both OTP codes and email links
4. **Added delay before view change** - Ensures state is set before navigation

## How to Test

### Test 1: Create Account with Email Verification

1. **Start the app** and go to the landing page
2. **Click "Start Free Trial"** or navigate to signup
3. **Complete all 9 onboarding steps**:
   - Step 1: Welcome screen
   - Step 2: Select your goals
   - Step 3: Experience level
   - Step 4: Age range and life stage
   - Step 5: Practice time and session length
   - Step 6: Voice preference
   - Step 7: Check-in times
   - Step 8: Wake and sleep times
   - Step 9: Enter name, email, and password

4. **Click "Journey Onward"** on the final step

### Expected Behavior

**In the browser console, you should see:**
```
🌌 Creating account for: your@email.com
📬 Signup result: {needsVerification: true, email: "your@email.com"}
💾 Setting pending profile and email: your@email.com
📧 Verification email sent to: your@email.com
🔄 Navigating to auth view for verification
🔍 Auth view - pendingVerificationEmail: your@email.com
✉️ Rendering VerificationScreen for: your@email.com
```

**You should see:**
- A verification screen with 6-digit code input boxes
- Instructions mentioning both OTP code AND email link options
- Your email address displayed

### Two Ways to Verify

#### Option A: Email Link (Default Supabase Behavior)
1. **Check your email inbox** for an email from your Supabase project
2. **Click the "Confirm your email" link** in the email
3. **You'll be redirected back to the app** and automatically logged in
4. Console should show: `🔔 Auth state changed: SIGNED_IN`
5. **Profile setup should complete automatically**

#### Option B: OTP Code (If Enabled in Supabase)
1. **Check your email** for a 6-digit code
2. **Enter the code** in the verification screen
3. **Click "Verify Email"**
4. **Profile setup should complete**

## Supabase Configuration Check

### If Email Links Don't Work:

1. **Go to your Supabase Dashboard**
2. Navigate to: **Authentication > Settings**
3. Check **"Enable email confirmations"** is ON
4. Set **Redirect URLs** to include: `http://localhost:5173`

### To Enable OTP Codes Instead:

1. **Go to Supabase Dashboard**
2. Navigate to: **Authentication > Settings**
3. Find **"Enable email OTP"**
4. **Toggle it ON**

## Common Issues

### Issue 1: No Email Received
- Check spam/junk folder
- Verify Supabase email settings are configured
- Check Supabase logs for email delivery errors

### Issue 2: Stuck on Verification Screen
- Check browser console for errors
- Verify `pendingVerificationEmail` is set (should show in console)
- Try clicking "Resend Code" button

### Issue 3: Email Link Doesn't Work
- Ensure redirect URL is configured in Supabase
- Check if auth state change is logged in console
- Try copying the link and opening in same browser

## Success Criteria

✅ **Account creation successful if:**
1. Console shows signup completion messages
2. Verification screen displays with your email
3. Email is received (check spam folder)
4. Clicking email link OR entering OTP code completes setup
5. You're redirected to the dashboard
6. Your profile data is saved in Supabase

## Console Commands to Debug

Open browser console and run:

```javascript
// Check pending verification email
console.log('Pending email:', localStorage.getItem('kaya-pending-signup'));

// Check if user is authenticated
supabase.auth.getSession().then(({data}) => console.log('Session:', data));

// Check user profile
supabase.auth.getUser().then(({data}) => console.log('User:', data));
```

## Need Help?

If account creation still doesn't work, check:
1. Browser console for errors
2. Supabase Dashboard > Authentication > Users (should see new user)
3. Supabase Dashboard > Logs (for email delivery issues)
4. Network tab for failed API requests
