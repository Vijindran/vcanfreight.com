/**
 * Port Codes and Location Utilities
 * Maps city names to UN/LOCODEs and provides country codes and addresses
 */

// Common port mappings (City -> LOCODE)
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
    'FELIXSTOWE': 'GBFXT',
    'SOUTHAMPTON': 'GBSOU',
    'LIVERPOOL': 'GBLIV',
    'JEBEL ALI': 'AEJEA',
    'TOKYO': 'JPTYO',
    'YOKOHAMA': 'JPYOK',
    'KOBE': 'JPUKB',
    'NAGOYA': 'JPNGO',
    'OSAKA': 'JPOSA',
    'HO CHI MINH': 'VNSGN',
    'HAIPHONG': 'VNHPH',
    'CHENNAI': 'INMAA',
    'NHAVA SHEVA': 'INNSA',
    'MUMBAI': 'INBOM',
    'COLOMBO': 'LKCMB',
    'JEDDAH': 'SAJED',
    'DAMMAM': 'SADMM',
    'SYDNEY': 'AUSYD',
    'MELBOURNE': 'AUMEL',
    'BRISBANE': 'AUBNE',
    'AUCKLAND': 'NZAKL',
    'VANCOUVER': 'CAVAN',
    'MONTREAL': 'CAMTR',
    'TORONTO': 'CATOR',
    'SANTOS': 'BRSSZ',
    'BUENOS AIRES': 'ARBUE',
    'VALPARAISO': 'CLVAP',
    'CALLAO': 'PECLL',
    'DURBAN': 'ZADUR',
    'CAPE TOWN': 'ZACPT',
    'MOMBASA': 'KEMBA',
    'LAGOS': 'NGLOS',
    'TEMA': 'GHTEM',
    'BARCELONA': 'ESBCN',
    'VALENCIA': 'ESVLC',
    'ALGECIRAS': 'ESALG',
    'GENOA': 'ITGOA',
    'LA SPEZIA': 'ITSPE',
    'MARSEILLE': 'FRMRS',
    'LE HAVRE': 'FRLEH',
    'BREMERHAVEN': 'DEBRV',
    'GDANSK': 'PLGDN',
    'GOTHENBURG': 'SEGOT',
    'AARHUS': 'DKAAR',
    'HELSINKI': 'FIHEL',
    'OSLO': 'NOOSL',
    'ST PETERSBURG': 'RULED',
    'NOVOROSSIYSK': 'RUNOV',
    'VLADIVOSTOK': 'RUVVO',
    'ISTANBUL': 'TRIST',
    'MERSIN': 'TRMER',
    'IZMIR': 'TRIZM',
    'PIRAEUS': 'GRPIR',
    'THESSALONIKI': 'GRSKG',
    'LIMASSOL': 'CYLMS',
    'HAIFA': 'ILHFA',
    'ASHDOD': 'ILASH',
    'ALEXANDRIA': 'EGALY',
    'PORT SAID': 'EGPSD',
    'CASABLANCA': 'MACAS',
    'TANGIER': 'MATNG',
};

// Country code mapping (LOCODE prefix -> Country Name/Code)
const locodeToCountry: Record<string, string> = {
    'CN': 'CN', // China
    'US': 'US', // United States
    'GB': 'GB', // United Kingdom
    'AE': 'AE', // United Arab Emirates
    'SG': 'SG', // Singapore
    'HK': 'HK', // Hong Kong
    'NL': 'NL', // Netherlands
    'DE': 'DE', // Germany
    'BE': 'BE', // Belgium
    'KR': 'KR', // South Korea
    'MY': 'MY', // Malaysia
    'TW': 'TW', // Taiwan
    'TH': 'TH', // Thailand
    'JP': 'JP', // Japan
    'VN': 'VN', // Vietnam
    'IN': 'IN', // India
    'LK': 'LK', // Sri Lanka
    'SA': 'SA', // Saudi Arabia
    'AU': 'AU', // Australia
    'NZ': 'NZ', // New Zealand
    'CA': 'CA', // Canada
    'BR': 'BR', // Brazil
    'AR': 'AR', // Argentina
    'CL': 'CL', // Chile
    'PE': 'PE', // Peru
    'ZA': 'ZA', // South Africa
    'KE': 'KE', // Kenya
    'NG': 'NG', // Nigeria
    'GH': 'GH', // Ghana
    'ES': 'ES', // Spain
    'IT': 'IT', // Italy
    'FR': 'FR', // France
    'PL': 'PL', // Poland
    'SE': 'SE', // Sweden
    'DK': 'DK', // Denmark
    'FI': 'FI', // Finland
    'NO': 'NO', // Norway
    'RU': 'RU', // Russia
    'TR': 'TR', // Turkey
    'GR': 'GR', // Greece
    'CY': 'CY', // Cyprus
    'IL': 'IL', // Israel
    'EG': 'EG', // Egypt
    'MA': 'MA', // Morocco
};

/**
 * Get UN/LOCODE for a city
 */
export function getPortCode(city: string): string {
    if (!city) return '';
    
    const normalized = city.toUpperCase().trim();
    
    // Check direct match
    if (cityToLocode[normalized]) {
        return cityToLocode[normalized];
    }
    
    // Check partial match
    for (const [key, code] of Object.entries(cityToLocode)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return code;
        }
    }
    
    // Fallback: Generate a fake but valid-looking code if not found
    // This allows the API call to proceed, though it might be rejected by SeaRates if invalid
    // Format: 2 char country + 3 char city
    const parts = normalized.split(' ');
    const cityPart = parts[0].substring(0, 3);
    return `XX${cityPart}`;
}

/**
 * Get Country Code (ISO 2-char) from city or LOCODE
 */
export function getCountryCode(cityOrLocode: string): string {
    if (!cityOrLocode) return 'US'; // Default
    
    // If it looks like a LOCODE (5 chars, uppercase)
    if (cityOrLocode.length === 5 && /^[A-Z]{5}$/.test(cityOrLocode)) {
        return cityOrLocode.substring(0, 2);
    }
    
    // Try to get LOCODE first
    const locode = getPortCode(cityOrLocode);
    if (locode && locode.length >= 2) {
        return locode.substring(0, 2);
    }
    
    return 'US'; // Default fallback
}

/**
 * Get a default address for a port
 */
export function getDefaultPortAddress(portCode: string, city: string): string {
    return `${city} Port, ${portCode}, Logistics Terminal`;
}
