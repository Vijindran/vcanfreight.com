# Subscription & Rates System

## ✅ What I Found

You mentioned having:
- **Life rates** for subscribers (real-time rates)
- **Cached rates** for non-subscribers (older/stale rates)

I found:
- ✅ Stripe checkout route (`/api/stripe/checkout`)
- ✅ Basic rates caching (`rates_cache` table)
- ❌ **Missing**: Subscription tracking in database
- ❌ **Missing**: Logic to differentiate subscribers vs non-subscribers
- ❌ **Missing**: Life rates table for real-time rates

## ✅ What I Just Added

### 1. Database Schema Updates

**Users Table** - Added subscription fields:
- `subscription_status` - 'free', 'active', 'lifetime', 'canceled'
- `subscription_expires_at` - Unix timestamp (NULL for lifetime)
- `stripe_customer_id` - Stripe customer ID
- `stripe_subscription_id` - Stripe subscription ID

**New Tables**:
- `subscriptions` - Tracks Stripe subscriptions
- `life_rates` - Real-time rates for subscribers (separate from cached rates)

### 2. Updated Rates Logic (`lib/rates.ts`)

The `getSeaRates()` function now:
- ✅ Checks if user has active subscription
- ✅ **Subscribers** → Get from `life_rates` table (real-time)
- ✅ **Non-subscribers** → Get from `rates_cache` table (cached)
- ✅ Fetches fresh rates from SeaRates API for subscribers if not in `life_rates`

### 3. Subscription Management Functions (`lib/cloudflare.ts`)

- `hasActiveSubscription()` - Check if user has active/lifetime subscription
- `updateUserSubscription()` - Update user subscription status
- `getUserById()` - Now includes subscription status

### 4. API Endpoints

**Subscription Status**:
- `GET /api/subscriptions/status` - Get user's subscription status

**Stripe Webhook**:
- `POST /api/subscriptions/webhook` - Handle Stripe subscription events
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## 📊 How It Works

### For Subscribers (Life Rates):
1. User has `subscription_status = 'active'` or `'lifetime'`
2. `getSeaRates()` checks `life_rates` table first
3. If not found, fetches **real-time** from SeaRates API
4. Stores in `life_rates` table for future use
5. Returns fresh, accurate rates

### For Non-Subscribers (Cached Rates):
1. User has `subscription_status = 'free'` or `'canceled'`
2. `getSeaRates()` checks `rates_cache` table
3. Returns older/cached rates (may be stale)
4. No API calls to save quota

## 🔧 Setup Instructions

### 1. Update Database Schema

Run the updated schema:

```bash
npx wrangler d1 execute vcanfreight-db --file=./schema.sql
```

Or if database already exists, run migration:

```sql
-- Add subscription fields to users table
ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_expires_at INTEGER;
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    plan_type TEXT DEFAULT 'premium',
    current_period_start INTEGER,
    current_period_end INTEGER,
    cancel_at_period_end INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create life_rates table
CREATE TABLE IF NOT EXISTS life_rates (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    transit_time INTEGER,
    carrier TEXT,
    service_type TEXT,
    container_type TEXT,
    valid_until INTEGER,
    source TEXT DEFAULT 'searates',
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_life_rates_route ON life_rates(origin, destination);
```

### 2. Configure Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Add endpoint: `https://vcanfreight.com/api/subscriptions/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to environment variable: `STRIPE_WEBHOOK_SECRET`

### 3. Update Environment Variables

Add to Cloudflare Pages environment variables:

```
STRIPE_WEBHOOK_SECRET=whsec_...
SEARATES_PLATFORM_ID=your_platform_id
SEARATES_API_KEY=your_api_key
```

### 4. Update Frontend to Check Subscription

When fetching rates, pass `userId`:

```typescript
import { getSeaRates } from '@/lib/rates';
import { useAuth } from '@/context/AuthContext';

const { user } = useAuth();
const rates = await getSeaRates(origin, destination, user?.id);
// rates.source will be 'life', 'cached', or 'mock'
```

## 📝 Usage Examples

### Check Subscription Status

```typescript
// Frontend
const response = await fetch('/api/subscriptions/status', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { hasSubscription, isLifetime, canAccessLifeRates } = await response.json();
```

### Get Rates (with subscription check)

```typescript
// Automatically uses life rates for subscribers, cached for non-subscribers
const rates = await getSeaRates('Shanghai', 'Los Angeles', userId);
if (rates.source === 'life') {
  console.log('Real-time rates for subscriber');
} else if (rates.source === 'cached') {
  console.log('Cached rates for non-subscriber');
}
```

## 🔄 Migration from Firebase

If you have subscription data in Firebase:

1. Export subscriptions collection
2. Format as:
   ```json
   {
     "subscriptions": [
       {
         "userId": "user123",
         "stripeSubscriptionId": "sub_...",
         "stripeCustomerId": "cus_...",
         "status": "active",
         "isLifetime": false,
         "expiresAt": 1234567890
       }
     ]
   }
   ```
3. Use migration API or script to import

## ✅ Summary

- ✅ **Life rates** → Stored in `life_rates` table, fetched real-time for subscribers
- ✅ **Cached rates** → Stored in `rates_cache` table, used for non-subscribers
- ✅ **Subscription tracking** → Full Stripe integration with webhooks
- ✅ **Automatic differentiation** → `getSeaRates()` handles it automatically

The system is now ready to differentiate between subscribers and non-subscribers! 🚀

