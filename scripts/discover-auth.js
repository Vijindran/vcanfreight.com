// Script to discover SeaRates Auth Endpoint
const discoverAuth = async () => {
    console.log('🧪 Discovering SeaRates Auth Endpoint\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    
    const authEndpoints = [
        'https://api.searates.com/v2/auth/login',
        'https://api.searates.com/auth/login',
        'https://api.searates.com/v2/login',
        'https://api.searates.com/login',
        'https://api.searates.com/v2/auth/token',
        'https://rates.searates.com/auth/login'
    ];
    
    for (const url of authEndpoints) {
        console.log(`\nTesting: ${url}`);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform_id: platformId,
                    api_key: apiKey
                })
            });
            
            console.log(`Status: ${response.status}`);
            const text = await response.text();
            if (response.ok) {
                console.log(`✅ FOUND! Response:`, text);
                return;
            } else {
                console.log(`❌ Failed: ${text.substring(0, 100)}`);
            }
        } catch (e) {
            console.log(`❌ Error: ${e.message}`);
        }
    }
};

discoverAuth().catch(console.error);

