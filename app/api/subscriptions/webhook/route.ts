import { NextResponse } from 'next/server';
import { getStripeInstance } from '@/lib/stripe';
import { updateUserSubscription } from '@/lib/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Stripe Webhook Handler
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let env: any;
        let db: D1Database | undefined;
        try {
            env = getRequestContext().env;
            db = env.DB;
        } catch (e) { /* ignore */ }
        
        db = db || (globalThis as any).__CF_DB__ as D1Database | undefined;

        const stripe = getStripeInstance(env);
        const webhookSecret = env?.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
        
        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET not configured');
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        // Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        if (!db) {
            console.error('D1 database not available');
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 500 }
            );
        }

        // Handle different event types
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as any;
                await handleSubscriptionUpdate(db, subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                await handleSubscriptionCanceled(db, subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as any;
                await handlePaymentSucceeded(db, invoice);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as any;
                await handlePaymentFailed(db, invoice);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed', message: error.message },
            { status: 500 }
        );
    }
}

async function handleSubscriptionUpdate(db: D1Database, subscription: any) {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const currentPeriodEnd = subscription.current_period_end;

    // Find user by Stripe customer ID
    const user = await db.prepare(
        'SELECT id FROM users WHERE stripe_customer_id = ?'
    ).bind(customerId).first<{ id: string }>();

    if (!user) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Determine subscription status
    let subscriptionStatus: 'free' | 'active' | 'lifetime' | 'canceled' = 'free';
    if (status === 'active' || status === 'trialing') {
        subscriptionStatus = 'active';
    } else if (status === 'canceled' || status === 'unpaid') {
        subscriptionStatus = 'canceled';
    }

    // Check if it's a lifetime subscription (custom logic - adjust as needed)
    const isLifetime = subscription.metadata?.lifetime === 'true' || 
                       subscription.items?.data?.[0]?.price?.metadata?.lifetime === 'true';

    if (isLifetime) {
        subscriptionStatus = 'lifetime';
    }

    // Update user subscription
    await updateUserSubscription(
        db,
        user.id,
        subscriptionStatus,
        isLifetime ? null : currentPeriodEnd,
        customerId,
        subscriptionId
    );

    // Update or create subscription record
    const now = Math.floor(Date.now() / 1000);
    await db.prepare(
        `INSERT OR REPLACE INTO subscriptions 
         (id, user_id, stripe_subscription_id, stripe_customer_id, status, 
          current_period_start, current_period_end, cancel_at_period_end, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        subscriptionId,
        user.id,
        subscriptionId,
        customerId,
        status,
        subscription.current_period_start,
        currentPeriodEnd,
        subscription.cancel_at_period_end ? 1 : 0,
        now
    ).run();
}

async function handleSubscriptionCanceled(db: D1Database, subscription: any) {
    const customerId = subscription.customer;
    
    const user = await db.prepare(
        'SELECT id FROM users WHERE stripe_customer_id = ?'
    ).bind(customerId).first<{ id: string }>();

    if (user) {
        await updateUserSubscription(
            db,
            user.id,
            'canceled',
            null,
            customerId,
            subscription.id
        );
    }
}

async function handlePaymentSucceeded(db: D1Database, invoice: any) {
    // Payment succeeded - subscription remains active
    // This is handled by subscription.updated event
    console.log('Payment succeeded for invoice:', invoice.id);
}

async function handlePaymentFailed(db: D1Database, invoice: any) {
    // Payment failed - mark subscription as past_due
    const customerId = invoice.customer;
    
    const user = await db.prepare(
        'SELECT id FROM users WHERE stripe_customer_id = ?'
    ).bind(customerId).first<{ id: string }>();

    if (user) {
        await updateUserSubscription(
            db,
            user.id,
            'canceled', // or 'past_due' if you want to give grace period
            null,
            customerId,
            invoice.subscription
        );
    }
}

