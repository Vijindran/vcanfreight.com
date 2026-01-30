import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { verifyJWT, getUserById } from '@/lib/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

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
        const decoded = await verifyJWT(token, jwtSecret);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Try to get DB from Cloudflare env first
        let db: D1Database | undefined = (globalThis as any).__CF_DB__;

        try {
            const ctx = getRequestContext();
            if (ctx.env && (ctx.env as any).DB) {
                db = (ctx.env as any).DB as D1Database;
            }
        } catch (e) {
            // Not in next-on-pages context, ignore
        }

        if (!db) {
            // Fallback for local development
            return NextResponse.json({
                user: {
                    id: decoded.userId,
                    email: decoded.email,
                    name: 'Demo User',
                }
            });
        }

        const user = await getUserById(db, decoded.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

