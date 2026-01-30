/**
 * SeaRates API Integration with Smart Caching (Recycle Logic)
 * 
 * This module handles fetching shipping rates from SeaRates API and implements
 * a "recycle" mechanism to stay within the 50 API calls/month limit.
 */
import type { D1Database } from '@cloudflare/workers-types';
import type { CloudflareEnv } from './cloudflare';

export interface RateResult {
    price: number;
    currency: string;
    transitTime: number;
    carrier: string;
    validUntil: string;
    source: 'live' | 'cached' | 'mock';
    requiresSubscription?: boolean; // True if user needs to subscribe for real rates
    isEstimate?: boolean; // True if this is an estimated rate (not real)
    error?: string;
}

/**
 * City name to SeaRates Numeric Point ID mapping
 * SeaRates API requires format: P_<numeric_id> for ports, A_<numeric_id> for airports
 * Format: P_ or A_ prefix + numeric ID (e.g., P_1234)
 */
const cityToPointId: Record<string, string> = {
    // Major Asia Ports
    'SHANGHAI': 'P_4',        // Shanghai Port (Port of Shanghai)
    'NINGBO': 'P_5',          // Ningbo Port
    'SHENZHEN': 'P_1',        // Shenzhen Port
    'GUANGZHOU': 'P_6',       // Guangzhou Port
    'QINGDAO': 'P_2',         // Qingdao Port
    'HONG KONG': 'P_3',       // Hong Kong Port
    'SINGAPORE': 'P_33',      // Singapore Port
    'BUSAN': 'P_30',          // Busan Port (South Korea)
    'KAOHSIUNG': 'P_26',      // Kaohsiung Port (Taiwan)
    'BANGKOK': 'P_120',       // Bangkok/Laem Chabang
    'LAEM CHABANG': 'P_120',  // Thailand
    
    // Middle East & Indian Ocean
    'DUBAI': 'P_42',          // Jebel Ali (Dubai)
    'JEBEL ALI': 'P_42',      
    'COLOMBO': 'P_75',        // Colombo Port (Sri Lanka)
    'NHAVA SHEVA': 'P_68',    // Nhava Sheva (India)
    'CHENNAI': 'P_66',        // Chennai Port (India)
    'MUMBAI': 'P_67',         // Mumbai Port (India)
    'JEDDAH': 'P_44',         // Jeddah Port (Saudi Arabia)
    
    // Europe Ports
    'ROTTERDAM': 'P_17',      // Rotterdam (Netherlands)
    'HAMBURG': 'P_18',        // Hamburg (Germany)
    'ANTWERP': 'P_16',        // Antwerp (Belgium)
    'FELIXSTOWE': 'P_7',      // Felixstowe (UK)
    'SOUTHAMPTON': 'P_8',     // Southampton (UK)
    'LIVERPOOL': 'P_9',       // Liverpool (UK)
    'LONDON': 'P_10',         // London/Tilbury (UK)
    'LE HAVRE': 'P_11',       // Le Havre (France)
    'MARSEILLE': 'P_12',      // Marseille (France)
    'BARCELONA': 'P_13',      // Barcelona (Spain)
    'VALENCIA': 'P_14',       // Valencia (Spain)
    'ALGECIRAS': 'P_15',      // Algeciras (Spain)
    'GENOA': 'P_19',          // Genoa (Italy)
    'BREMERHAVEN': 'P_20',    // Bremerhaven (Germany)
    'GDANSK': 'P_21',         // Gdansk (Poland)
    'GOTHENBURG': 'P_22',     // Gothenburg (Sweden)
    'HELSINKI': 'P_23',       // Helsinki (Finland)
    
    // Americas Ports
    'LOS ANGELES': 'P_35',    // Port of Los Angeles
    'LONG BEACH': 'P_36',     // Port of Long Beach
    'NEW YORK': 'P_24',       // Port of New York/New Jersey
    'OAKLAND': 'P_37',        // Port of Oakland
    'HOUSTON': 'P_38',        // Port of Houston
    'SAVANNAH': 'P_39',       // Port of Savannah
    'CHARLESTON': 'P_40',     // Port of Charleston
    'VANCOUVER': 'P_46',      // Port of Vancouver (Canada)
    'SANTOS': 'P_51',         // Port of Santos (Brazil)
    'BUENOS AIRES': 'P_52',   // Port of Buenos Aires (Argentina)
    'CALLAO': 'P_53',         // Port of Callao (Peru)
    'VALPARAISO': 'P_54',     // Port of Valparaiso (Chile)
    
    // Asia-Pacific
    'SYDNEY': 'P_55',         // Port of Sydney (Australia)
    'MELBOURNE': 'P_56',      // Port of Melbourne (Australia)
    'BRISBANE': 'P_57',       // Port of Brisbane (Australia)
    'AUCKLAND': 'P_58',       // Port of Auckland (New Zealand)
    'TOKYO': 'P_25',          // Port of Tokyo/Yokohama (Japan)
    'YOKOHAMA': 'P_25',       // Port of Yokohama (Japan)
    'KOBE': 'P_27',           // Port of Kobe (Japan)
    'NAGOYA': 'P_28',         // Port of Nagoya (Japan)
    'OSAKA': 'P_29',          // Port of Osaka (Japan)
    'HO CHI MINH': 'P_31',    // Saigon Port (Vietnam)
    'HAIPHONG': 'P_32',       // Haiphong Port (Vietnam)
    'PORT KELANG': 'P_34',    // Port of Port Kelang (Malaysia)
    
    // Africa Ports
    'DURBAN': 'P_59',         // Port of Durban (South Africa)
    'CAPE TOWN': 'P_60',      // Port of Cape Town (South Africa)
    'MOMBASA': 'P_61',        // Port of Mombasa (Kenya)
    'LAGOS': 'P_62',          // Port of Lagos (Nigeria)
    'TEMA': 'P_63',           // Port of Tema (Ghana)
};

/**
 * Get realistic estimated rates based on route
 * Used when SeaRates API doesn't return real rates
 */
function getEstimatedRateForRoute(origin: string, destination: string): { price: number; transitTime: number; carrier: string } {
    const route = `${origin}→${destination}`;
    
    // Estimated rates for common routes (in USD for 20ft container FCL)
    const estimatedRates: Record<string, { price: number; transitTime: number; carrier: string }> = {
        // Asia-North America
        'SHANGHAI→LOS ANGELES': { price: 1850, transitTime: 18, carrier: 'Maersk/CMA CGM' },
        'SHANGHAI→NEW YORK': { price: 2400, transitTime: 35, carrier: 'Maersk/MSC' },
        'SINGAPORE→LOS ANGELES': { price: 1750, transitTime: 15, carrier: 'Evergreen/ONE' },
        'HONG KONG→LOS ANGELES': { price: 1900, transitTime: 16, carrier: 'COSCO/Maersk' },
        'BUSAN→LOS ANGELES': { price: 1650, transitTime: 17, carrier: 'Hyundai/Maersk' },
        
        // Asia-Europe
        'SHANGHAI→ROTTERDAM': { price: 1200, transitTime: 32, carrier: 'Maersk/MSC' },
        'SINGAPORE→ROTTERDAM': { price: 1100, transitTime: 28, carrier: 'Evergreen/ONE' },
        'HONG KONG→HAMBURG': { price: 1300, transitTime: 32, carrier: 'COSCO/Hapag' },
        'SHANGHAI→HAMBURG': { price: 1250, transitTime: 33, carrier: 'Maersk/CMA' },
        
        // Intra-Asia
        'SHANGHAI→SINGAPORE': { price: 450, transitTime: 5, carrier: 'ONE/COSCO' },
        'HONG KONG→SINGAPORE': { price: 350, transitTime: 4, carrier: 'Evergreen/MSC' },
        'SHANGHAI→HONG KONG': { price: 300, transitTime: 3, carrier: 'OOCL/Maersk' },
        
        // Asia-Australia
        'SHANGHAI→SYDNEY': { price: 950, transitTime: 13, carrier: 'Maersk/ONE' },
        'SHANGHAI→MELBOURNE': { price: 1050, transitTime: 15, carrier: 'MSC/Evergreen' },
        
        // Americas Routes
        'LOS ANGELES→NEW YORK': { price: 3500, transitTime: 10, carrier: 'Maersk/MSC' },
        'LOS ANGELES→ROTTERDAM': { price: 3200, transitTime: 30, carrier: 'CMA CGM/ONE' },
        
        // Europe Intra
        'ROTTERDAM→HAMBURG': { price: 250, transitTime: 2, carrier: 'Maersk/MSC' },
        'ROTTERDAM→ANTWERP': { price: 200, transitTime: 1, carrier: 'ONE/Evergreen' },
    };
    
    // Check exact route
    if (estimatedRates[route]) {
        return estimatedRates[route];
    }
    
    // Fallback: estimate based on distance
    // Default estimate for unknown routes
    return {
        price: 1250,
        transitTime: 24,
        carrier: 'SeaRates Estimated'
    };
}

/**
 * Get rates with SMART CACHING to maximize 50 API calls/month
 */
export async function getSeaRates(
    origin: string,
    destination: string,
    userId?: string,
    env?: CloudflareEnv
): Promise<RateResult> {
    const db = env?.DB || (globalThis as any).__CF_DB__ as D1Database | undefined;

    // Fallback for local development without DB
    if (!db) {
        const estimated = getEstimatedRateForRoute(origin, destination);
        return {
            price: estimated.price,
            currency: 'USD',
            transitTime: estimated.transitTime,
            carrier: estimated.carrier,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            source: 'mock',
            isEstimate: true
        };
    }

    const now = Math.floor(Date.now() / 1000);
    const normalizedOrigin = origin.trim().toUpperCase();
    const normalizedDest = destination.trim().toUpperCase();

    // Check if user has active subscription
    let isSubscriber = false;
    if (userId && userId !== 'guest') {
        try {
            const { hasActiveSubscription } = await import('./cloudflare');
            isSubscriber = await hasActiveSubscription(db, userId);
        } catch (e) {
            console.error('Error checking subscription:', e);
        }
    }

    // STEP 1: Check cache FIRST (Recycle Logic)
    // Check both tables - any valid rate is recycled
    let cachedRate = await db.prepare(
        `SELECT * FROM life_rates 
         WHERE origin = ? AND destination = ? AND valid_until > ? 
         ORDER BY updated_at DESC LIMIT 1`
    ).bind(normalizedOrigin, normalizedDest, now).first<{
        price: number;
        currency: string;
        transit_time: number;
        carrier: string;
        valid_until: number;
    }>();

    if (!cachedRate) {
        cachedRate = await db.prepare(
            `SELECT * FROM rates_cache 
             WHERE origin = ? AND destination = ? AND valid_until > ? 
             ORDER BY created_at DESC LIMIT 1`
        ).bind(normalizedOrigin, normalizedDest, now).first<{
            price: number;
            currency: string;
            transit_time: number;
            carrier: string;
            valid_until: number;
        }>();
    }

    // If valid cache exists, recycle it! (Saves API calls)
    if (cachedRate) {
        console.log(`♻️ Recycling cached rate: ${normalizedOrigin} → ${normalizedDest}`);
        return {
            price: cachedRate.price,
            currency: cachedRate.currency || 'USD',
            transitTime: cachedRate.transit_time || 24,
            carrier: cachedRate.carrier || 'SeaRates Carrier',
            validUntil: new Date(cachedRate.valid_until * 1000).toISOString().split('T')[0],
            source: isSubscriber ? 'live' : 'cached',
            requiresSubscription: !isSubscriber,
            isEstimate: !isSubscriber
        };
    }

    // STEP 2: No cache found - only subscribers can trigger API calls
    if (!isSubscriber) {
        const estimated = getEstimatedRateForRoute(normalizedOrigin, normalizedDest);
        return {
            price: estimated.price,
            currency: 'USD',
            transitTime: estimated.transitTime,
            carrier: `${estimated.carrier} (Estimated)`,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            source: 'mock',
            requiresSubscription: true,
            isEstimate: true
        };
    }

    // STEP 3: Subscriber triggers fresh API call
    const realTimeRate = await fetchRealTimeRate(normalizedOrigin, normalizedDest, env);

    if (realTimeRate) {
        // If API returned an error (e.g. invalid key), return it immediately without caching
        if (realTimeRate.error) {
            return realTimeRate;
        }

        const validUntil = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
        const timestamp = Math.floor(Date.now() / 1000);

        // Store in BOTH tables for future recycling
        try {
            const lifeRateId = `life_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.prepare(
                `INSERT INTO life_rates (id, origin, destination, price, currency, transit_time, carrier, valid_until, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(lifeRateId, normalizedOrigin, normalizedDest, realTimeRate.price, realTimeRate.currency,
                realTimeRate.transitTime, realTimeRate.carrier, validUntil, timestamp, timestamp).run();

            const cacheRateId = `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.prepare(
                `INSERT INTO rates_cache (id, origin, destination, price, currency, transit_time, carrier, valid_until, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(cacheRateId, normalizedOrigin, normalizedDest, realTimeRate.price, realTimeRate.currency,
                realTimeRate.transitTime, realTimeRate.carrier, validUntil, timestamp).run();

            console.log(`✅ Fresh rate cached for future recycling: ${normalizedOrigin} → ${normalizedDest}`);
        } catch (e) {
            console.error('Error storing rate in cache:', e);
        }

        return {
            ...realTimeRate,
            validUntil: new Date(validUntil * 1000).toISOString().split('T')[0],
            source: 'live'
        };
    }

    // API failed, return estimated rate
    const estimated = getEstimatedRateForRoute(normalizedOrigin, normalizedDest);
    return {
        price: estimated.price,
        currency: 'USD',
        transitTime: estimated.transitTime,
        carrier: `${estimated.carrier} (Estimated)`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        source: 'mock',
        requiresSubscription: true,
        isEstimate: true
    };
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

/**
 * Fetch real-time rate from SeaRates API
 */
async function fetchRealTimeRate(origin: string, destination: string, env?: CloudflareEnv): Promise<RateResult | null> {
    const token = await getPlatformToken(env);

    if (!token) {
        console.error('🚨 CRITICAL: Could not obtain SeaRates Platform Token.');
        return {
            error: 'API configuration error: Could not obtain Platform Token',
            price: 0,
            currency: 'USD',
            transitTime: 0,
            carrier: '',
            validUntil: '',
            source: 'mock'
        };
    }

    console.log(`📡 Fetching live SeaRates API for: ${origin} → ${destination}`);

    // Map city names to SeaRates numeric Point IDs
    // Format: P_<numeric_id> for ports, A_<numeric_id> for airports
    // Note: These are the known port IDs for major ports.
    // If a port is not in this map, we'll return an estimate.
    const fromPointId = cityToPointId[origin];
    const toPointId = cityToPointId[destination];
    
    // If we don't have point IDs, return null to trigger fallback estimate
    if (!fromPointId || !toPointId) {
        console.log(`⚠️ Unknown port(s): ${origin} → ${destination}. Using estimate instead.`);
        return null;
    }
    
    // Format date as YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch('https://rates.searates.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query Rates {
                        rates(
                            shippingType: FCL
                            pointIdFrom: "${fromPointId}"
                            pointIdTo: "${toPointId}"
                            date: "${date}"
                            container: ST20
                        ) {
                            points {
                                provider
                                totalPrice
                                totalCurrency
                            }
                            general {
                                totalPrice
                                totalCurrency
                                totalTransitTime
                            }
                        }
                    }
                `
            })
        });

        const raw = await response.text();
        let data: any = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch (_) {
            console.error(`SeaRates API non-JSON response (${response.status}):`, raw?.slice(0, 200));
            return null;
        }

        if (!response.ok) {
            console.error(`SeaRates API Error (${response.status}):`, data?.message || data);
            return null;
        }

        if (data.errors && data.errors.length > 0) {
            console.error('SeaRates GraphQL Errors:', data.errors.map((e: any) => e.message).join(', '));
            return null;
        }

        const general = data.data?.rates?.general;
        const points = data.data?.rates?.points || [];
        const firstPoint = Array.isArray(points) && points.length > 0 ? points[0] : null;

        const price = general?.totalPrice ?? firstPoint?.totalPrice ?? 0;
        const currency = general?.totalCurrency ?? firstPoint?.totalCurrency ?? 'USD';
        const transitTime = general?.totalTransitTime ?? 0;
        const carrier = firstPoint?.provider || 'SeaRates Carrier';

        if (price && price > 0) {
            console.log(`✅ SeaRates API success - Real rate: $${price} ${currency}, Transit: ${transitTime} days`);
            return {
                price,
                currency,
                transitTime: transitTime || 24,
                carrier,
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                source: 'live'
            };
        }

        console.log('⚠️ SeaRates returned no price for this route');
    } catch (e) {
        console.error('SeaRates API call failed:', e instanceof Error ? e.message : String(e));
    }

    return null;
}
