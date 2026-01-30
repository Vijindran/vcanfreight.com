-- Cloudflare D1 Database Schema for VCANFreight

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT, -- bcrypt hash for email/password auth
    subscription_status TEXT DEFAULT 'free', -- 'free', 'active', 'lifetime', 'canceled'
    subscription_expires_at INTEGER, -- Unix timestamp, NULL for lifetime
    stripe_customer_id TEXT, -- Stripe customer ID
    stripe_subscription_id TEXT, -- Stripe subscription ID
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    container_type TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    cargo_description TEXT,
    booking_status TEXT DEFAULT 'pending',
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Rates cache table (for non-subscribers)
CREATE TABLE IF NOT EXISTS rates_cache (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    transit_time INTEGER,
    carrier TEXT,
    valid_until INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Subscriptions table (track Stripe subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing', 'lifetime'
    plan_type TEXT DEFAULT 'premium', -- 'premium', 'lifetime'
    current_period_start INTEGER,
    current_period_end INTEGER,
    cancel_at_period_end INTEGER DEFAULT 0, -- 0 or 1 (boolean)
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Life rates table (real-time rates for subscribers)
CREATE TABLE IF NOT EXISTS life_rates (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    transit_time INTEGER,
    carrier TEXT,
    service_type TEXT, -- 'FCL', 'LCL', 'AIR'
    container_type TEXT, -- '20ft', '40ft', etc.
    valid_until INTEGER,
    source TEXT DEFAULT 'searates', -- 'searates', 'manual', etc.
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_rates_cache_route ON rates_cache(origin, destination);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_life_rates_route ON life_rates(origin, destination);

