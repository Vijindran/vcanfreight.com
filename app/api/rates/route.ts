import { NextResponse } from 'next/server';
import { getSeaRates } from '@/lib/rates';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Commented out to fix local dev 500 error

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const type = searchParams.get('type') || 'FCL'; // 'FCL', 'LCL', 'AIR'

    if (!origin || !destination) {
        return NextResponse.json({ error: 'Origin and destination required' }, { status: 400 });
    }

    try {
        // Get user ID from auth token if available
        let userId: string | undefined;
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
                const { verifyJWT } = await import('@/lib/cloudflare');
                const user = await verifyJWT(token, jwtSecret);
                if (user) {
                    userId = user.userId;
                }
            } catch (e) {
                // Invalid token - treat as guest
            }
        }

        let env: any;
        try {
             env = getRequestContext().env;
        } catch (e) {
             // Ignore error if not running in Cloudflare Pages environment
        }

        const rate = await getSeaRates(origin, destination, userId, env);

        const effectiveRate = rate.error ? {
            carrier: 'VCAN Freight (fallback)',
            price: 0,
            currency: 'USD',
            transitTime: 14,
            requiresSubscription: false,
            isEstimate: true,
            note: rate.error,
        } : rate;

        return NextResponse.json({
            rates: [
                {
                    id: `rate_${Date.now()}`,
                    carrier: effectiveRate.carrier,
                    price: effectiveRate.price,
                    currency: effectiveRate.currency,
                    transitTime: effectiveRate.transitTime,
                    cutoff: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock cutoff
                    serviceType: type,
                    requiresSubscription: (effectiveRate as any).requiresSubscription,
                    isEstimate: (effectiveRate as any).isEstimate,
                    note: (effectiveRate as any).note,
                }
            ],
            warning: rate.error ? 'SeaRates upstream failed; returning fallback rate' : undefined,
        });
    } catch (error: any) {
        console.error('Rate fetch error:', error);
        return NextResponse.json({
            rates: [
                {
                    id: `rate_${Date.now()}`,
                    carrier: 'VCAN Freight (fallback)',
                    price: 0,
                    currency: 'USD',
                    transitTime: 14,
                    cutoff: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    serviceType: type,
                    requiresSubscription: false,
                    isEstimate: true,
                    note: error?.message || 'Upstream rate error',
                }
            ],
            warning: 'SeaRates upstream failed; returning fallback rate',
        }, { status: 200 });
    }
}
