# Firebase Users Migration Guide

## ✅ Firebase Analysis Results

Based on your Firebase project analysis:

- **Firestore Database**: Empty (no collections) ✅
- **Authentication**: 2 users found:
  1. `vg@vcanresources.com` (Google OAuth)
  2. `vijindran79@...` (Email/Password)
- **Functions**: Not deployed ✅

**Great news**: Since Firestore is empty, we only need to migrate the 2 users!

## 🚀 Migration Steps

### Step 1: Create D1 Database

```powershell
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"
npx wrangler d1 create vcanfreight-db
```

**Important**: Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "19de061f-5e36-4c13-838f-1a0aa7bc85df"
```

### Step 2: Initialize Database Schema

```powershell
npx wrangler d1 execute vcanfreight-db --file=./schema.sql
```

This creates all tables:
- `users` (with subscription fields)
- `bookings`
- `rates_cache`
- `subscriptions`
- `life_rates`

### Step 3: Update User Migration Script

Before running, update `migrate-firebase-users.sql`:

1. **Get the full email** for the second user from Firebase Console
2. **Get Google ID** for `vg@vcanresources.com` if available (optional)

Edit the file and replace:
- `vijindran79@...` with the full email address
- `google_...` with actual Google ID if you have it

### Step 4: Migrate Firebase Users

```powershell
npx wrangler d1 execute vcanfreight-db --file=./migrate-firebase-users.sql
```

### Step 5: Verify Migration

```powershell
npx wrangler d1 execute vcanfreight-db --command "SELECT id, email, name, subscription_status FROM users"
```

You should see both users.

## ⚠️ Important Notes

### Password Migration
- **Firebase doesn't expose password hashes** for security reasons
- Users will need to **reset their passwords** after migration
- Or you can set a temporary password and force reset on first login

### Google OAuth Users
- User `vg@vcanresources.com` will need to **sign in again with Google**
- Their email and name will be preserved
- The Google OAuth flow will create/update their account

### Email/Password Users
- User `vijindran79@...` will need to **reset password**
- They can use "Forgot Password" flow after migration

## 🔧 Alternative: Manual User Creation

If you prefer to create users manually through the app:

1. **Skip the migration script**
2. Have users **register again**:
   - `vg@vcanresources.com` → Sign in with Google
   - `vijindran79@...` → Register with email/password

Since there's no Firestore data, this is perfectly fine!

## 📊 Current Backend Status

Your Cloudflare backend is **already set up** with:

✅ **API Routes** (Next.js Pages API):
- `/api/auth/login` - Email/password login
- `/api/auth/register` - User registration
- `/api/auth/google` - Google OAuth
- `/api/auth/google/callback` - OAuth callback
- `/api/auth/me` - Get current user
- `/api/bookings` - Create/fetch bookings
- `/api/subscriptions/status` - Check subscription
- `/api/subscriptions/webhook` - Stripe webhooks
- `/api/migrate` - Data migration endpoint

✅ **Database Schema**:
- Users (with subscription tracking)
- Bookings
- Rates cache (for non-subscribers)
- Life rates (for subscribers)
- Subscriptions (Stripe integration)

## 🎯 Next Steps

1. **Create D1 database** (Step 1 above)
2. **Initialize schema** (Step 2)
3. **Migrate users** (Step 3-4) OR let them register fresh
4. **Set environment variables** in Cloudflare Pages:
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `STRIPE_SECRET_KEY` - From Stripe Dashboard
   - `STRIPE_WEBHOOK_SECRET` - From Stripe Webhooks
   - `SEARATES_PLATFORM_ID` - (Optional) For rates API
   - `SEARATES_API_KEY` - (Optional) For rates API

5. **Deploy to Cloudflare Pages**:
   ```powershell
   npm run build
   npx wrangler pages deploy .next
   ```

## ✅ Migration Complete!

Once done, your Firebase users will be in Cloudflare D1, and the app will work exactly as before (or better, with subscription features)!

---

**Questions?** The backend is ready - you just need to:
1. Create the database
2. Run the schema
3. Migrate the 2 users (or let them re-register)

Since Firestore is empty, this is super simple! 🚀

