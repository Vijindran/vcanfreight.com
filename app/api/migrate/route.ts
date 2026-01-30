import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Migration API Endpoint
 * 
 * POST /api/migrate
 * 
 * Accepts Firebase data and migrates it to Cloudflare D1
 * 
 * Body:
 * {
 *   users?: Array<FirebaseUser>,
 *   bookings?: Array<FirebaseBooking>,
 *   rates?: Array<FirebaseRate>
 * }
 */
export async function POST(request: Request) {
    try {
        // Verify admin access (you should add proper admin authentication)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin token required' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const user = await verifyJWT(token, jwtSecret);
        
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        const data = await request.json() as any;
        const db = (globalThis as any).__CF_DB__ as D1Database | undefined;

        if (!db) {
            return NextResponse.json(
                { error: 'D1 database not available' },
                { status: 500 }
            );
        }

        const results = {
            users: { imported: 0, errors: 0 },
            bookings: { imported: 0, errors: 0 },
            rates: { imported: 0, errors: 0 },
        };

        // Migrate Users
        if (data.users && Array.isArray(data.users)) {
            for (const firebaseUser of data.users) {
                try {
                    const userId = firebaseUser.uid || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const now = Math.floor(Date.now() / 1000);
                    const createdAt = firebaseUser.createdAt?.seconds || firebaseUser.createdAt || now;

                    await db.prepare(
                        `INSERT OR REPLACE INTO users (id, email, name, password_hash, google_id, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        userId,
                        firebaseUser.email || '',
                        firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                        null, // Password hash - users will need to reset password
                        null, // Google ID - extract from provider data if available
                        createdAt,
                        createdAt
                    ).run();

                    results.users.imported++;
                } catch (error: any) {
                    console.error('Error importing user:', error);
                    results.users.errors++;
                }
            }
        }

        // Migrate Bookings
        if (data.bookings && Array.isArray(data.bookings)) {
            for (const firebaseBooking of data.bookings) {
                try {
                    const bookingId = firebaseBooking.id || `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const now = Math.floor(Date.now() / 1000);
                    const createdAt = firebaseBooking.createdAt?.seconds || firebaseBooking.createdAt || now;
                    const updatedAt = firebaseBooking.updatedAt?.seconds || firebaseBooking.updatedAt || createdAt;

                    await db.prepare(
                        `INSERT OR REPLACE INTO bookings (id, user_id, container_type, origin, destination, cargo_description, booking_status, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        bookingId,
                        firebaseBooking.userId,
                        firebaseBooking.containerType || 'FCL',
                        firebaseBooking.origin || '',
                        firebaseBooking.destination || '',
                        firebaseBooking.cargoDescription || null,
                        firebaseBooking.status || 'pending',
                        createdAt,
                        updatedAt
                    ).run();

                    results.bookings.imported++;
                } catch (error: any) {
                    console.error('Error importing booking:', error);
                    results.bookings.errors++;
                }
            }
        }

        // Migrate Rates
        if (data.rates && Array.isArray(data.rates)) {
            for (const firebaseRate of data.rates) {
                try {
                    const rateId = firebaseRate.id || `rate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const now = Math.floor(Date.now() / 1000);
                    const createdAt = firebaseRate.createdAt?.seconds || firebaseRate.createdAt || now;
                    const validUntil = firebaseRate.validUntil?.seconds || firebaseRate.validUntil || null;

                    await db.prepare(
                        `INSERT OR REPLACE INTO rates_cache (id, origin, destination, price, currency, transit_time, carrier, valid_until, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        rateId,
                        firebaseRate.origin,
                        firebaseRate.destination,
                        firebaseRate.price,
                        firebaseRate.currency || 'USD',
                        firebaseRate.transitTime || null,
                        firebaseRate.carrier || null,
                        validUntil,
                        createdAt
                    ).run();

                    results.rates.imported++;
                } catch (error: any) {
                    console.error('Error importing rate:', error);
                    results.rates.errors++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            results,
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: 'Migration failed', message: error.message },
            { status: 500 }
        );
    }
}

