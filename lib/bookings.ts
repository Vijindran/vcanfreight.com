
import type { D1Database } from '@cloudflare/workers-types';
import type { CloudflareEnv } from './cloudflare';

export interface SearatesBookingRequest {
    shipmentId?: string;
    rateId?: string;
    platformId: number;
    route: {
        origin: {
            port_code: string;
            city: string;
            country: string;
            address?: string;
        };
        destination: {
            port_code: string;
            city: string;
            country: string;
            address?: string;
        };
    };
    equipment: {
        type: string;
        quantity: number;
        cargo_weight_kg: number;
        cargo_description: string;
        hs_code?: string;
    };
    parties: {
        shipper: {
            company: string;
            contact: string;
            email: string;
            phone: string;
            address: string;
            tax_id?: string;
        };
        consignee: {
            company: string;
            contact: string;
            email: string;
            phone: string;
            address: string;
            tax_id?: string;
        };
    };
    dates: {
        cargo_ready: string;
        estimated_departure?: string;
        estimated_arrival?: string;
    };
    payment_terms: string;
    references: {
        client_reference?: string;
        internal_reference: string;
    };
}

export interface SearatesBookingResponse {
    success: boolean;
    bookingId?: string;
    status?: string;
    error?: string;
    message?: string;
    details?: any;
}

// Token management variables
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getPlatformToken(env?: CloudflareEnv): Promise<string | null> {
    const now = Date.now();
    // Buffer of 5 minutes to ensure token doesn't expire mid-request
    if (cachedToken && now < tokenExpiry - 300000) {
        return cachedToken;
    }

    const platformId = env?.SEARATES_PLATFORM_ID || '29979';
    const apiKey = env?.SEARATES_API_KEY || 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const url = `https://www.searates.com/auth/platform-token?id=${platformId}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Failed to fetch platform token:', await response.text());
            return null;
        }
        const data = await response.json() as { "s-token": string };
        const token = data["s-token"];
        
        if (!token) {
             console.error('Token not found in response:', data);
             return null;
        }

        cachedToken = token;
        // Refresh every 4 hours (14400000 ms)
        tokenExpiry = now + 14400000;
        return token;
    } catch (e) {
        console.error('Error fetching platform token:', e);
        return null;
    }
}

export async function createSearatesBooking(
    request: SearatesBookingRequest,
    userId: string,
    env?: CloudflareEnv
): Promise<SearatesBookingResponse> {
    const token = await getPlatformToken(env);

    if (!token) {
        return {
            success: false,
            error: 'Authentication Error',
            message: 'Could not obtain SeaRates Platform Token'
        };
    }

    try {
        // Use the correct booking endpoint
        const response = await fetch('https://www.searates.com/api/logistics/v2/bookings', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        // SeaRates sometimes returns HTML error bodies; guard parsing
        const raw = await response.text();
        let data: any = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch (_) {
            data = { error: 'Invalid JSON from SeaRates', message: raw?.slice(0, 200) || 'No body' };
        }

        if (!response.ok) {
            console.error('SeaRates Booking API Error:', data);
            return {
                success: false,
                error: data.error || 'Booking Failed',
                message: data.message || `Failed to create booking with SeaRates (status ${response.status})`,
                details: data
            };
        }

        if (data.status === 'success' || data.booking_id) {
            return {
                success: true,
                bookingId: data.booking_id || data.id,
                status: data.status || 'pending',
                message: 'Booking created successfully'
            };
        }

        return {
            success: false,
            error: 'Unknown Error',
            message: 'Unexpected response from SeaRates API',
            details: data
        };

    } catch (e) {
        console.error('Error creating SeaRates booking:', e);
        return {
            success: false,
            error: 'Network Error',
            message: e instanceof Error ? e.message : String(e)
        };
    }
}
