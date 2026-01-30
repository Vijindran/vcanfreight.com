/**
 * Migration Script: Firebase to Cloudflare D1
 * 
 * This script helps migrate data from Firebase Firestore to Cloudflare D1.
 * 
 * Usage:
 * 1. Export your Firebase data (users, bookings, rates)
 * 2. Place the exported JSON files in the /data directory
 * 3. Run: npx tsx scripts/migrate-firebase-to-cloudflare.ts
 * 
 * Or provide data directly via API endpoint
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: any;
  // Add other Firebase user fields as needed
}

interface FirebaseBooking {
  id?: string;
  userId: string;
  containerType: string;
  origin: string;
  destination: string;
  cargoDescription?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
  // Add other booking fields as needed
}

interface FirebaseRate {
  id?: string;
  origin: string;
  destination: string;
  price: number;
  currency?: string;
  transitTime?: number;
  carrier?: string;
  validUntil?: any;
  createdAt?: any;
}

/**
 * Convert Firebase timestamp to Unix timestamp
 */
function convertTimestamp(firebaseTimestamp: any): number {
  if (!firebaseTimestamp) return Math.floor(Date.now() / 1000);
  
  // If it's a Firestore Timestamp object
  if (firebaseTimestamp.seconds) {
    return firebaseTimestamp.seconds;
  }
  
  // If it's a Date object
  if (firebaseTimestamp instanceof Date) {
    return Math.floor(firebaseTimestamp.getTime() / 1000);
  }
  
  // If it's already a number (Unix timestamp)
  if (typeof firebaseTimestamp === 'number') {
    return Math.floor(firebaseTimestamp / 1000);
  }
  
  // If it's an ISO string
  if (typeof firebaseTimestamp === 'string') {
    return Math.floor(new Date(firebaseTimestamp).getTime() / 1000);
  }
  
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert Firebase user to D1 format
 */
function convertUser(firebaseUser: FirebaseUser): {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  google_id: string | null;
  created_at: number;
  updated_at: number;
} {
  return {
    id: firebaseUser.uid || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    password_hash: null, // Firebase doesn't store password hashes, users will need to reset
    google_id: null, // Extract from provider data if available
    created_at: convertTimestamp(firebaseUser.createdAt),
    updated_at: convertTimestamp(firebaseUser.createdAt),
  };
}

/**
 * Convert Firebase booking to D1 format
 */
function convertBooking(firebaseBooking: FirebaseBooking): {
  id: string;
  user_id: string;
  container_type: string;
  origin: string;
  destination: string;
  cargo_description: string | null;
  booking_status: string;
  created_at: number;
  updated_at: number;
} {
  return {
    id: firebaseBooking.id || `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: firebaseBooking.userId,
    container_type: firebaseBooking.containerType || 'FCL',
    origin: firebaseBooking.origin || '',
    destination: firebaseBooking.destination || '',
    cargo_description: firebaseBooking.cargoDescription || null,
    booking_status: firebaseBooking.status || 'pending',
    created_at: convertTimestamp(firebaseBooking.createdAt),
    updated_at: convertTimestamp(firebaseBooking.updatedAt || firebaseBooking.createdAt),
  };
}

/**
 * Convert Firebase rate to D1 format
 */
function convertRate(firebaseRate: FirebaseRate): {
  id: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  transit_time: number | null;
  carrier: string | null;
  valid_until: number | null;
  created_at: number;
} {
  return {
    id: firebaseRate.id || `rate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    origin: firebaseRate.origin,
    destination: firebaseRate.destination,
    price: firebaseRate.price,
    currency: firebaseRate.currency || 'USD',
    transit_time: firebaseRate.transitTime || null,
    carrier: firebaseRate.carrier || null,
    valid_until: convertTimestamp(firebaseRate.validUntil),
    created_at: convertTimestamp(firebaseRate.createdAt),
  };
}

/**
 * Generate SQL INSERT statements for D1
 */
function generateSQLInserts(
  users: any[],
  bookings: any[],
  rates: any[]
): string {
  const statements: string[] = [];
  
  // Users
  users.forEach((user) => {
    const converted = convertUser(user);
    statements.push(
      `INSERT OR REPLACE INTO users (id, email, name, password_hash, google_id, created_at, updated_at) VALUES ` +
      `('${converted.id}', '${converted.email.replace(/'/g, "''")}', '${converted.name.replace(/'/g, "''")}', ` +
      `${converted.password_hash ? `'${converted.password_hash}'` : 'NULL'}, ` +
      `${converted.google_id ? `'${converted.google_id}'` : 'NULL'}, ` +
      `${converted.created_at}, ${converted.updated_at});`
    );
  });
  
  // Bookings
  bookings.forEach((booking) => {
    const converted = convertBooking(booking);
    statements.push(
      `INSERT OR REPLACE INTO bookings (id, user_id, container_type, origin, destination, cargo_description, booking_status, created_at, updated_at) VALUES ` +
      `('${converted.id}', '${converted.user_id}', '${converted.container_type}', ` +
      `'${converted.origin.replace(/'/g, "''")}', '${converted.destination.replace(/'/g, "''")}', ` +
      `${converted.cargo_description ? `'${converted.cargo_description.replace(/'/g, "''")}'` : 'NULL'}, ` +
      `'${converted.booking_status}', ${converted.created_at}, ${converted.updated_at});`
    );
  });
  
  // Rates
  rates.forEach((rate) => {
    const converted = convertRate(rate);
    statements.push(
      `INSERT OR REPLACE INTO rates_cache (id, origin, destination, price, currency, transit_time, carrier, valid_until, created_at) VALUES ` +
      `('${converted.id}', '${converted.origin.replace(/'/g, "''")}', '${converted.destination.replace(/'/g, "''")}', ` +
      `${converted.price}, '${converted.currency}', ` +
      `${converted.transit_time || 'NULL'}, ` +
      `${converted.carrier ? `'${converted.carrier.replace(/'/g, "''")}'` : 'NULL'}, ` +
      `${converted.valid_until || 'NULL'}, ${converted.created_at});`
    );
  });
  
  return statements.join('\n');
}

/**
 * Main migration function
 */
export async function migrateFirebaseToCloudflare(
  usersData?: FirebaseUser[],
  bookingsData?: FirebaseBooking[],
  ratesData?: FirebaseRate[]
) {
  const dataDir = join(process.cwd(), 'data');
  
  // Try to load from files if not provided
  let users: FirebaseUser[] = usersData || [];
  let bookings: FirebaseBooking[] = bookingsData || [];
  let rates: FirebaseRate[] = ratesData || [];
  
  if (!usersData || !bookingsData || !ratesData) {
    if (existsSync(join(dataDir, 'users.json'))) {
      users = JSON.parse(readFileSync(join(dataDir, 'users.json'), 'utf-8'));
    }
    if (existsSync(join(dataDir, 'bookings.json'))) {
      bookings = JSON.parse(readFileSync(join(dataDir, 'bookings.json'), 'utf-8'));
    }
    if (existsSync(join(dataDir, 'rates.json'))) {
      rates = JSON.parse(readFileSync(join(dataDir, 'rates.json'), 'utf-8'));
    }
  }
  
  // Generate SQL
  const sql = generateSQLInserts(users, bookings, rates);
  
  // Save SQL file
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  const sqlFile = join(dataDir, 'migration.sql');
  writeFileSync(sqlFile, sql, 'utf-8');
  
  console.log(`✅ Migration SQL generated: ${sqlFile}`);
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Bookings: ${bookings.length}`);
  console.log(`   - Rates: ${rates.length}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review the SQL file: ${sqlFile}`);
  console.log(`   2. Run it against your Cloudflare D1 database:`);
  console.log(`      wrangler d1 execute vcanfreight-db --file=./data/migration.sql`);
  
  return {
    users: users.length,
    bookings: bookings.length,
    rates: rates.length,
    sqlFile,
  };
}

// If run directly
if (require.main === module) {
  migrateFirebaseToCloudflare().catch(console.error);
}



