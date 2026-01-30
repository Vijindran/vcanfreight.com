import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Stripe Price IDs from your Stripe Dashboard
const STRIPE_PRICE_IDS = {
    monthly: 'price_1SQGZWPyJngwy6BVs5l7MyOM',  // Premium Monthly - $9.99/month
    yearly: 'price_1SQGdnPyJngwy6BVuvDoVkUC',   // Pro Subscription Yearly - $99.00/year
};

// Stripe API for Edge Runtime (using fetch instead of SDK)
async function createStripeCheckoutSession(planId: string, origin: string) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
        throw new Error('Stripe secret key not configured');
    }

    const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS];
    if (!priceId) {
        throw new Error(`Invalid plan: ${planId}`);
    }

    // Create checkout session using Stripe API directly with Price ID
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'mode': 'subscription',
            'payment_method_types[0]': 'card',
            'line_items[0][price]': priceId,
            'line_items[0][quantity]': '1',
            'success_url': `${origin}/booking?success=true&plan=${planId}`,
            'cancel_url': `${origin}/subscription?canceled=true`,
            'allow_promotion_codes': 'true',
        }).toString(),
    });

    if (!response.ok) {
        const error = await response.json() as any;
        console.error('Stripe API error:', error);
        throw new Error(error?.error?.message || 'Failed to create checkout session');
    }

    return response.json();
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as any;
        const { planId } = body;

        if (!planId || !['monthly', 'yearly'].includes(planId)) {
            return NextResponse.json({ 
                error: 'Invalid plan selected',
                message: 'Please select a valid subscription plan'
            }, { status: 400 });
        }

        const origin = request.headers.get('origin') || 'https://vcanfreight.com';
        
        const session = await createStripeCheckoutSession(planId, origin) as any;

        return NextResponse.json({ 
            url: session.url,
            sessionId: session.id 
        });
    } catch (err: any) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json({ 
            error: err.message || 'Failed to create checkout session',
            message: 'Payment system temporarily unavailable. Please try again or contact support.'
        }, { status: 500 });
    }
}
