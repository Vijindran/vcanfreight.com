import { NextResponse } from 'next/server';
import { verifyJWT, hasActiveSubscription } from '@/lib/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Get user subscription status
 * GET /api/subscriptions/status
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
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

        const db = (globalThis as any).__CF_DB__ as D1Database | undefined;
        if (!db) {
            return NextResponse.json({
                hasSubscription: false,
                status: 'free',
                expiresAt: null,
                isLifetime: false
            });
        }

        const userData = await db.prepare(
            'SELECT subscription_status, subscription_expires_at FROM users WHERE id = ?'
        ).bind(user.userId).first<{
            subscription_status: string;
            subscription_expires_at: number | null;
        }>();

        if (!userData) {
            return NextResponse.json({
                hasSubscription: false,
                status: 'free',
                expiresAt: null,
                isLifetime: false
            });
        }

        const isActive = await hasActiveSubscription(db, user.userId);
        const isLifetime = userData.subscription_status === 'lifetime';

        return NextResponse.json({
            hasSubscription: isActive,
            status: userData.subscription_status,
            expiresAt: userData.subscription_expires_at 
                ? new Date(userData.subscription_expires_at * 1000).toISOString()
                : null,
            isLifetime,
            canAccessLifeRates: isActive
        });
    } catch (error: any) {
        console.error('Subscription status error:', error);
        return NextResponse.json(
            { error: 'Failed to get subscription status', message: error.message },
            { status: 500 }
        );
    }
}

