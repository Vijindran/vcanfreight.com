import { NextRequest, NextResponse } from 'next/server';
import { getSchedules } from '@/lib/schedules';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * Schedules API Route
 * 
 * GET /api/schedules?type=sea|air&origin=Shanghai&destination=Los Angeles
 * 
 * For Sea Freight: Uses SeaRates Schedules API
 * For Airfreight: Uses Airlines API (AviationStack or similar)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get('type') || 'sea') as 'sea' | 'air';
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';

  // Validate inputs
  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Origin and destination are required' },
      { status: 400 }
    );
  }

  if (type !== 'sea' && type !== 'air') {
    return NextResponse.json(
      { error: 'Type must be either "sea" or "air"' },
      { status: 400 }
    );
  }

  try {
    let env: any;
    try {
        env = getRequestContext().env;
    } catch (e) { /* ignore */ }

    // Fetch schedules from SeaRates (sea) or Airlines API (air)
    const schedules = await getSchedules(type, origin, destination, env);

    return NextResponse.json({ 
      schedules,
      count: schedules.length,
      type,
      origin,
      destination
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch schedules',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

