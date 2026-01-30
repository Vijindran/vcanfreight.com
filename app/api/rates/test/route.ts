import { NextResponse } from 'next/server';
import { getSeaRates } from '@/lib/rates';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Test endpoint for SeaRates API
 * GET /api/rates/test?origin=Shanghai&destination=Los Angeles&userId=test
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const origin = searchParams.get('origin') || 'Shanghai';
        const destination = searchParams.get('destination') || 'Los Angeles';
        const userId = searchParams.get('userId') || undefined;

        console.log('🧪 Testing rates API...');
        console.log(`   Origin: ${origin}`);
        console.log(`   Destination: ${destination}`);
        console.log(`   User ID: ${userId || 'none (non-subscriber)'}`);

        let env: any;
        try {
             env = getRequestContext().env;
        } catch (e) {
             // Ignore error if not running in Cloudflare Pages environment
        }

        // Test the rates function
        const rate = await getSeaRates(origin, destination, userId, env);

        const result = {
            success: true,
            test: {
                origin,
                destination,
                userId: userId || null,
                timestamp: new Date().toISOString(),
            },
            rate,
            apiStatus: {
                platformId: env?.SEARATES_PLATFORM_ID || process.env.SEARATES_PLATFORM_ID || '29979',
                apiKeyConfigured: !!(env?.SEARATES_API_KEY || process.env.SEARATES_API_KEY) || true, // Default key in code
                apiUrl: env?.SEARATES_API_URL || process.env.SEARATES_API_URL || 'https://api.searates.com/v2',
            },
            cacheStatus: rate.source === 'live' ? 'From live API' : 
                        rate.source === 'cached' ? 'From rates_cache' : 
                        rate.source === 'mock' ? 'Mock data (no cache, no API call)' : 'Unknown',
        };

        console.log('✅ Test result:', JSON.stringify(result, null, 2));

        return NextResponse.json(result, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error('❌ Test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

