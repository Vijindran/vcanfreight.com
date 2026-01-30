import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, hashPassword, generateJWT } from '@/lib/cloudflare';
import { sendWelcomeEmail } from '@/lib/email';
import type { D1Database } from '@cloudflare/workers-types';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json() as any;
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Get database from Cloudflare environment
        let env: any;
        let db: D1Database | undefined;
        try {
            env = getRequestContext().env;
            db = env.DB;
        } catch (e) { /* ignore */ }
        
        db = db || (globalThis as any).__CF_DB__ as D1Database | undefined;
        const jwtSecret = env?.JWT_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-in-production';

        if (!db) {
            // Fallback for local development
            console.warn('D1 database not available, using mock response');
            const mockUserId = `usr_${Date.now()}`;
            return NextResponse.json({
                user: {
                    id: mockUserId,
                    name,
                    email,
                },
                token: 'mock_jwt_token_123'
            });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(db, email);

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const userId = await createUser(db, email, name, passwordHash);

        // Generate JWT token
        const token = await generateJWT(userId, email, jwtSecret);

        // Send welcome email (don't wait for it, don't fail registration if email fails)
        sendWelcomeEmail(name, email, env).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        return NextResponse.json({
            user: {
                id: userId,
                name,
                email,
            },
            token,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error.message },
            { status: 500 }
        );
    }
}

