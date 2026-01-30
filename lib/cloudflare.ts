// Cloudflare D1 Database and Authentication utilities
import type { D1Database } from '@cloudflare/workers-types';

export interface CloudflareEnv {
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SEARATES_PLATFORM_ID?: string;
  SEARATES_API_KEY?: string;
  AVIATION_STACK_API_KEY?: string;
  RESEND_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

// JWT Token utilities
export async function generateJWT(
  userId: string,
  email: string,
  secret: string
): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    iat: Math.floor(Date.now() / 1000),
  }));
  const signature = await signJWT(`${header}.${payload}`, secret);
  return `${header}.${payload}.${signature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<{
  userId: string;
  email: string;
} | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.warn('Invalid JWT format:', token.substring(0, 20));
        return null;
    }

    const [header, payload, signature] = parts;
    const expectedSignature = await signJWT(`${header}.${payload}`, secret);

    if (signature !== expectedSignature) {
        console.warn('JWT signature mismatch');
        return null;
    }

    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
        console.warn('JWT expired:', { exp: decoded.exp, now });
        return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (e: any) {
    console.error('JWT verification error:', e.message);
    return null;
  }
}

async function signJWT(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Password hashing (using Web Crypto API - for production, consider using a proper bcrypt implementation)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Database helper functions
export async function getUserByEmail(
  db: D1Database,
  email: string
): Promise<{
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  google_id: string | null;
} | null> {
  const result = await db
    .prepare('SELECT id, email, name, password_hash, google_id FROM users WHERE email = ?')
    .bind(email)
    .first<{
      id: string;
      email: string;
      name: string;
      password_hash: string | null;
      google_id: string | null;
    }>();
  return result || null;
}

export async function createUser(
  db: D1Database,
  email: string,
  name: string,
  passwordHash: string
): Promise<string> {
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Math.floor(Date.now() / 1000);

  await db
    .prepare(
      'INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(userId, email, name, passwordHash, now, now)
    .run();

  return userId;
}

export async function getUserById(
  db: D1Database,
  userId: string
): Promise<{
  id: string;
  email: string;
  name: string;
  subscription_status: string;
  subscription_expires_at: number | null;
} | null> {
  const result = await db
    .prepare('SELECT id, email, name, subscription_status, subscription_expires_at FROM users WHERE id = ?')
    .bind(userId)
    .first<{
      id: string;
      email: string;
      name: string;
      subscription_status: string;
      subscription_expires_at: number | null;
    }>();
  return result || null;
}

/**
 * Check if user has active subscription (premium or lifetime)
 */
export async function hasActiveSubscription(
  db: D1Database,
  userId: string
): Promise<boolean> {
  const user = await getUserById(db, userId);
  if (!user) return false;
  
  // Check if subscription is active or lifetime
  if (user.subscription_status === 'lifetime') return true;
  if (user.subscription_status === 'active') {
    // Check if subscription hasn't expired
    if (user.subscription_expires_at && user.subscription_expires_at > Math.floor(Date.now() / 1000)) {
      return true;
    }
    // If no expiry date, assume active
    if (!user.subscription_expires_at) return true;
  }
  
  return false;
}

/**
 * Update user subscription status
 */
export async function updateUserSubscription(
  db: D1Database,
  userId: string,
  status: 'free' | 'active' | 'lifetime' | 'canceled',
  expiresAt: number | null = null,
  stripeCustomerId: string | null = null,
  stripeSubscriptionId: string | null = null
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  
  await db
    .prepare(
      `UPDATE users 
       SET subscription_status = ?, 
           subscription_expires_at = ?, 
           stripe_customer_id = COALESCE(?, stripe_customer_id),
           stripe_subscription_id = COALESCE(?, stripe_subscription_id),
           updated_at = ?
       WHERE id = ?`
    )
    .bind(status, expiresAt, stripeCustomerId, stripeSubscriptionId, now, userId)
    .run();
}

