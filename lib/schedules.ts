import type { CloudflareEnv } from './cloudflare';

/**
 * SeaRates Schedules API Integration
 * For Sea Freight: Uses SeaRates Schedules API
 * For Airfreight: Uses Airlines API (AviationStack or similar)
 */

export interface Schedule {
  id: string;
  type: 'sea' | 'air';
  origin: string;
  destination: string;
  carrier: string;
  departure: string;
  arrival: string;
  transitTime: number;
  frequency: string;
  vessel?: string;
  flight?: string;
  status: 'available' | 'full' | 'delayed';
  originCode?: string;
  destinationCode?: string;
}

// SeaRates API Configuration
// Get from environment variables (Cloudflare Workers) or use defaults
function getSeaRatesConfig(env?: CloudflareEnv) {
  const processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {} as any;
  return {
    platformId: env?.SEARATES_PLATFORM_ID || processEnv.SEARATES_PLATFORM_ID || '29979',
    apiKey: env?.SEARATES_API_KEY || processEnv.SEARATES_API_KEY || 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11',
    baseUrl: 'https://www.searates.com',
  };
}

// City name to LOCODE mapping (same as rates.ts)
const cityToLocode: Record<string, string> = {
  'SHANGHAI': 'CNSHA',
  'LOS ANGELES': 'USLAX',
  'NEW YORK': 'USNYC',
  'LONDON': 'GBLON',
  'DUBAI': 'AEDXB',
  'SINGAPORE': 'SGSIN',
  'HONG KONG': 'HKHKG',
  'ROTTERDAM': 'NLRTM',
  'HAMBURG': 'DEHAM',
  'ANTWERP': 'BEANT',
  'NINGBO': 'CNNGB',
  'SHENZHEN': 'CNSZX',
  'GUANGZHOU': 'CNCAN',
  'BUSAN': 'KRBUS',
  'QINGDAO': 'CNTAO',
  'PORT KELANG': 'MYPKG',
  'KAOHSIUNG': 'TWKHH',
  'LAEM CHABANG': 'THLCH',
};

// Airport IATA code mapping for airfreight
const cityToAirport: Record<string, string> = {
  'SHANGHAI': 'PVG',
  'LOS ANGELES': 'LAX',
  'NEW YORK': 'JFK',
  'LONDON': 'LHR',
  'DUBAI': 'DXB',
  'SINGAPORE': 'SIN',
  'HONG KONG': 'HKG',
  'ROTTERDAM': 'AMS', // Amsterdam (nearest)
  'HAMBURG': 'HAM',
  'ANTWERP': 'BRU', // Brussels (nearest)
  'NINGBO': 'NGB',
  'SHENZHEN': 'SZX',
  'GUANGZHOU': 'CAN',
  'BUSAN': 'PUS',
  'QINGDAO': 'TAO',
  'PORT KELANG': 'KUL', // Kuala Lumpur (nearest)
  'KAOHSIUNG': 'KHH',
  'LAEM CHABANG': 'BKK', // Bangkok (nearest)
};

// Token management variables
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getSeaRatesToken(env?: CloudflareEnv): Promise<string | null> {
    const now = Date.now();
    // Buffer of 5 minutes to ensure token doesn't expire mid-request
    if (cachedToken && now < tokenExpiry - 300000) {
        return cachedToken;
    }

    const config = getSeaRatesConfig(env);
    const url = `${config.baseUrl}/auth/platform-token?id=${config.platformId}&api_key=${config.apiKey}`;

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
 * Normalize city name for lookup
 */
function normalizeCityName(city: string): string {
  return city.toUpperCase().trim();
}

/**
 * Get LOCODE from city name
 */
function getLocode(city: string): string | null {
  const normalized = normalizeCityName(city);
  // Try direct match first
  if (cityToLocode[normalized]) {
    return cityToLocode[normalized];
  }
  // Try partial match
  for (const [key, code] of Object.entries(cityToLocode)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }
  return null;
}

/**
 * Get Airport IATA code from city name
 */
function getAirportCode(city: string): string | null {
  const normalized = normalizeCityName(city);
  // Try direct match first
  if (cityToAirport[normalized]) {
    return cityToAirport[normalized];
  }
  // Try partial match
  for (const [key, code] of Object.entries(cityToAirport)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }
  return null;
}

/**
 * Fetch Sea Freight Schedules from SeaRates API
 */
export async function getSeaSchedules(
  origin: string,
  destination: string,
  env?: CloudflareEnv
): Promise<Schedule[]> {
  try {
    const originLocode = getLocode(origin);
    const destLocode = getLocode(destination);

    if (!originLocode || !destLocode) {
      console.error('Could not resolve LOCODEs:', { origin, destination });
      return [];
    }

    // Get Bearer token
    const token = await getSeaRatesToken(env);
    if (!token) {
      console.error('Failed to get SeaRates token');
      return [];
    }

    const config = getSeaRatesConfig(env);

    // Try SeaRates Schedules API
    // Endpoint: https://docs.searates.com/reference/schedules/v1/search-vessels
    const response = await fetch(
      `${config.baseUrl}/api/schedules/v1/search-vessels?` +
      `origin=${originLocode}&` +
      `destination=${destLocode}&` +
      `weeks_ahead=4`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('SeaRates schedules API error:', response.status, response.statusText);
      // Try alternative endpoint
      return await getSeaSchedulesAlternative(originLocode, destLocode, token, env);
    }

    const data = await response.json() as any;
    
    // Transform SeaRates response to our Schedule format
    if (data.schedules && Array.isArray(data.schedules)) {
      return data.schedules.map((schedule: any, index: number) => ({
        id: `sea-${index}-${Date.now()}`,
        type: 'sea' as const,
        origin: `${origin} (${originLocode})`,
        destination: `${destination} (${destLocode})`,
        carrier: schedule.carrier || schedule.shipping_line || 'Unknown',
        departure: schedule.departure_date || schedule.etd || new Date().toISOString().split('T')[0],
        arrival: schedule.arrival_date || schedule.eta || new Date().toISOString().split('T')[0],
        transitTime: schedule.transit_time || schedule.days || 21,
        frequency: schedule.frequency || 'Weekly',
        vessel: schedule.vessel_name || schedule.vessel || 'N/A',
        status: schedule.available ? 'available' : 'full',
        originCode: originLocode,
        destinationCode: destLocode,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching sea schedules:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * Alternative SeaRates Schedules endpoint
 */
async function getSeaSchedulesAlternative(
  originLocode: string,
  destLocode: string,
  token: string,
  env?: CloudflareEnv
): Promise<Schedule[]> {
  try {
    const config = getSeaRatesConfig(env);
    
    // Try Logistics V2 API for schedules
    const response = await fetch(
      `${config.baseUrl}/api/logistics/v2/schedules?` +
      `origin=${originLocode}&` +
      `destination=${destLocode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as any;
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((schedule: any, index: number) => ({
        id: `sea-alt-${index}-${Date.now()}`,
        type: 'sea' as const,
        origin: `${originLocode}`,
        destination: `${destLocode}`,
        carrier: schedule.carrier || 'Unknown',
        departure: schedule.etd || new Date().toISOString().split('T')[0],
        arrival: schedule.eta || new Date().toISOString().split('T')[0],
        transitTime: schedule.transit_days || 21,
        frequency: 'Weekly',
        vessel: schedule.vessel || 'N/A',
        status: 'available' as const,
        originCode: originLocode,
        destinationCode: destLocode,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching sea schedules (alternative):', error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * Fetch Airfreight Schedules from Airlines API
 * Using AviationStack API (free tier available) or similar
 */
export async function getAirSchedules(
  origin: string,
  destination: string,
  env?: CloudflareEnv
): Promise<Schedule[]> {
  try {
    const originAirport = getAirportCode(origin);
    const destAirport = getAirportCode(destination);

    if (!originAirport || !destAirport) {
      console.error('Could not resolve airport codes:', { origin, destination });
      return [];
    }

    // Option 1: AviationStack API (requires API key - free tier available)
    // You can get a free API key from https://aviationstack.com/
    // For Cloudflare Workers, set AVIATION_STACK_API_KEY in wrangler.toml [vars]
    const processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {} as any;
    const AVIATION_STACK_API_KEY = env?.AVIATION_STACK_API_KEY || 
                                   processEnv.AVIATION_STACK_API_KEY || '';
    
    if (AVIATION_STACK_API_KEY) {
      return await getAirSchedulesAviationStack(originAirport, destAirport, env);
    }

    // Option 2: FlightAware API (alternative)
    // Option 3: OpenSky Network API (free, no key required but limited)
    // Option 4: Mock data for now (remove when real API is integrated)
    return getAirSchedulesMock(originAirport, destAirport);
  } catch (error) {
    console.error('Error fetching air schedules:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * Get air schedules from AviationStack API
 */
async function getAirSchedulesAviationStack(
  originAirport: string,
  destAirport: string,
  env?: CloudflareEnv
): Promise<Schedule[]> {
  try {
    // Get API key from environment (Cloudflare Workers use env vars)
    const processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {} as any;
    const AVIATION_STACK_API_KEY = env?.AVIATION_STACK_API_KEY || 
                                   processEnv.AVIATION_STACK_API_KEY || '';
    
    if (!AVIATION_STACK_API_KEY) {
      console.log('AviationStack API key not configured, using mock data');
      return getAirSchedulesMock(originAirport, destAirport);
    }

    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `https://api.aviationstack.com/v1/flights?` +
      `access_key=${AVIATION_STACK_API_KEY}&` +
      `dep_iata=${originAirport}&` +
      `arr_iata=${destAirport}&` +
      `flight_date=${today}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('AviationStack API error:', response.status);
      return getAirSchedulesMock(originAirport, destAirport);
    }

    const data = await response.json() as any;
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((flight: any, index: number) => ({
        id: `air-${index}-${Date.now()}`,
        type: 'air' as const,
        origin: `${originAirport}`,
        destination: `${destAirport}`,
        carrier: flight.airline?.name || flight.airline?.iata || 'Unknown',
        departure: flight.departure?.scheduled?.split('T')[0] || today,
        arrival: flight.arrival?.scheduled?.split('T')[0] || today,
        transitTime: 1, // Airfreight is typically same day or next day
        frequency: 'Daily',
        flight: `${flight.flight?.iata || flight.flight?.number || 'N/A'}`,
        status: flight.flight_status === 'scheduled' ? 'available' : 'delayed',
        originCode: originAirport,
        destinationCode: destAirport,
      }));
    }

    return getAirSchedulesMock(originAirport, destAirport);
  } catch (error) {
    console.error('Error fetching air schedules from AviationStack:', error instanceof Error ? error.message : String(error));
    return getAirSchedulesMock(originAirport, destAirport);
  }
}

/**
 * Mock air schedules (fallback when API is not available)
 */
function getAirSchedulesMock(
  originAirport: string,
  destAirport: string
): Schedule[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const carriers = [
    { name: 'Cathay Pacific', code: 'CX' },
    { name: 'China Airlines', code: 'CI' },
    { name: 'Singapore Airlines', code: 'SQ' },
    { name: 'Emirates', code: 'EK' },
    { name: 'Lufthansa Cargo', code: 'LH' },
  ];

  return carriers.map((carrier, index) => {
    const departure = new Date(today);
    departure.setDate(departure.getDate() + index);
    const arrival = new Date(departure);
    arrival.setDate(arrival.getDate() + 1);

    return {
      id: `air-mock-${index}-${Date.now()}`,
      type: 'air' as const,
      origin: `${originAirport}`,
      destination: `${destAirport}`,
      carrier: carrier.name,
      departure: departure.toISOString().split('T')[0],
      arrival: arrival.toISOString().split('T')[0],
      transitTime: 1,
      frequency: 'Daily',
      flight: `${carrier.code}${800 + index}`,
      status: 'available' as const,
      originCode: originAirport,
      destinationCode: destAirport,
    };
  });
}

/**
 * Main function to get schedules (sea or air)
 */
export async function getSchedules(
  type: 'sea' | 'air',
  origin: string,
  destination: string,
  env?: CloudflareEnv
): Promise<Schedule[]> {
  if (type === 'sea') {
    return await getSeaSchedules(origin, destination, env);
  } else {
    return await getAirSchedules(origin, destination, env);
  }
}

