# Quick Firebase Migration Guide

## ✅ Your Firebase Status

Based on your analysis:
- ✅ **Firestore**: Empty (no collections) - **Nothing to migrate!**
- ✅ **Authentication**: 2 users found
- ✅ **Functions**: Not deployed - **Nothing to migrate!**

**Result**: Super simple migration - just the 2 users!

## 🚀 3-Step Migration

### Step 1: Create D1 Database

```powershell
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"
npx wrangler d1 create vcanfreight-db
```

**Copy the `database_id`** from output and paste it in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "19de061f-5e36-4c13-838f-1a0aa7bc85df"  # ← Pasted for you!
```

### Step 2: Initialize Database

```powershell
npx wrangler d1 execute vcanfreight-db --file=./schema.sql
```

This creates all tables (users, bookings, rates, subscriptions).

### Step 3: Migrate 2 Users

**First, update the email** in `migrate-firebase-users.sql`:
- Open the file
- Find `vijindran79@...`
- Replace with the **full email** from Firebase Console

Then run:

```powershell
npx wrangler d1 execute vcanfreight-db --file=./migrate-firebase-users.sql
```

**Verify**:

```powershell
npx wrangler d1 execute vcanfreight-db --command "SELECT id, email, name FROM users"
```

## ⚠️ Important: Password Reset

Since Firebase doesn't expose password hashes:
- **User 2** (`vijindran79@...`) will need to **reset password** after migration
- They can use "Forgot Password" in the app

**User 1** (`vg@vcanresources.com`) will just sign in with Google again.

## 🎯 Your Backend is Ready!

Your Cloudflare Pages backend already has:

✅ **All API Routes**:
- `/api/auth/login` - Login
- `/api/auth/register` - Register
- `/api/auth/google` - Google OAuth
- `/api/bookings` - Create/fetch bookings
- `/api/subscriptions/status` - Check subscription
- `/api/subscriptions/webhook` - Stripe webhooks

✅ **Subscription System**:
- Life rates for subscribers
- Cached rates for non-subscribers

✅ **Database Schema**:
- Users (with subscription tracking)
- Bookings
- Rates (cached + life rates)
- Subscriptions

## 📝 Next Steps After Migration

1. **Set Environment Variables** in Cloudflare Pages Dashboard:
   - `JWT_SECRET` - Generate: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `STRIPE_SECRET_KEY` - From Stripe Dashboard
   - `STRIPE_WEBHOOK_SECRET` - From Stripe Webhooks

2. **Deploy**:
   ```powershell
   npm run build
   npx wrangler pages deploy .next
   ```

3. **Test**:
   - Visit your domain
   - User 1: Sign in with Google
   - User 2: Use "Forgot Password" to reset, then login

## ✅ Done!

That's it! Since Firestore is empty, migration is super simple. Your backend is already more complete than the basic Workers setup - you have subscription support, life rates, and full Stripe integration! 🚀

---

**Note**: We're using **Cloudflare Pages** (not Workers) because you have a Next.js app. This gives you:
- Full Next.js SSR/SSG support
- API routes that work seamlessly
- Better integration with your frontend

The API endpoints work the same way, just accessed via your domain instead of a workers.dev subdomain.

