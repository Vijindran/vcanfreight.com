import { getRequestContext } from '@cloudflare/next-on-pages';
import type { D1Database } from '@cloudflare/workers-types';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Create Stripe Checkout Session for Booking Payment
 * This handles one-time payments for freight bookings
 */
export async function POST(request: Request) {
    try {
        // Verify user authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const user = await verifyJWT(token, jwtSecret);

        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json() as any;
        const { amount, currency, bookingId, description } = body;

        // Basic input validation with conservative defaults
        const parsedAmount = Number(amount);
        const sanitizedAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : NaN;
        const allowedCurrencies = new Set(['usd', 'eur', 'gbp', 'cad', 'aud', 'sgd']);
        const normalizedCurrency = (currency || 'usd').toString().toLowerCase();

        if (!bookingId || Number.isNaN(sanitizedAmount) || !allowedCurrencies.has(normalizedCurrency)) {
            return NextResponse.json({
                error: 'Invalid payment payload',
                message: 'Booking, amount, or currency is invalid'
            }, { status: 400 });
        }

        // Validate booking ownership when DB is available
        let db: D1Database | undefined;
        try {
            const ctx = getRequestContext();
            if (ctx?.env && 'DB' in ctx.env) {
                db = (ctx.env as any).DB as D1Database;
            }
        } catch (_) {
            /* Edge runtime may not expose DB; proceed without blocking */
        }

        if (db) {
            const bookingRow = await db.prepare('SELECT user_id FROM bookings WHERE id = ? LIMIT 1').bind(bookingId).first<any>();
            if (!bookingRow) {
                return NextResponse.json({ error: 'Booking not found', message: 'Unable to locate booking for payment' }, { status: 404 });
            }
            if (bookingRow.user_id && bookingRow.user_id !== user.userId) {
                return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this booking' }, { status: 403 });
            }
        }

        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey) {
            return NextResponse.json({
                error: 'Payment system not configured',
                message: 'Stripe is not configured. Please contact support.'
            }, { status: 500 });
        }

        const origin = request.headers.get('origin') || 'https://vcanfreight.com';

        // Create Stripe Checkout Session for one-time payment
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'mode': 'payment',
                'payment_method_types[0]': 'card',
                'line_items[0][price_data][currency]': normalizedCurrency,
                'line_items[0][price_data][product_data][name]': description || `Freight Booking ${bookingId}`,
                'line_items[0][price_data][product_data][description]': `Payment for booking ${bookingId}`,
                'line_items[0][price_data][unit_amount]': Math.round(sanitizedAmount * 100).toString(), // Convert to cents
                'line_items[0][quantity]': '1',
                'success_url': `${origin}/dashboard?payment=success&booking_id=${bookingId}`,
                'cancel_url': `${origin}/booking?payment=canceled&booking_id=${bookingId}`,
                'client_reference_id': bookingId,
                'customer_email': user.email,
                'metadata[booking_id]': bookingId,
                'metadata[user_id]': user.userId,
            }).toString(),
        });

        if (!response.ok) {
            const error = await response.json() as any;
            console.error('Stripe API error:', error);
            throw new Error(error.error?.message || 'Failed to create checkout session');
        }

        const session = await response.json() as any;

        return NextResponse.json({
            url: session.url,
            sessionId: session.id
        });
    } catch (err: any) {
        console.error('Stripe booking checkout error:', err);
        return NextResponse.json({
            error: err.message || 'Failed to create checkout session',
            message: 'Payment system temporarily unavailable. Please try again or contact support.'
        }, { status: 500 });
    }
}
