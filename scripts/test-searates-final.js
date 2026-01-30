// Final SeaRates API Test with Token Generation
const testSeaRatesWithToken = async () => {
    console.log('🧪 Final SeaRates API Test (Token-based)\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const origin = 'Shanghai';
    const destination = 'Los Angeles';
    
    try {
        // Step 1: Get Token
        console.log('🔑 Step 1: Getting Bearer Token...');
        const tokenUrl = `https://www.searates.com/auth/platform-token?id=${platformId}&api_key=${apiKey}`;
        const tokenRes = await fetch(tokenUrl);
        
        if (!tokenRes.ok) {
            console.error(`❌ Token fetch failed: ${tokenRes.status}`);
            const text = await tokenRes.text();
            console.error('Response:', text);
            return;
        }
        
        const tokenData = await tokenRes.json();
        const token = tokenData['s-token'] || tokenData.token || tokenData.access_token;
        
        if (!token) {
            console.error('❌ Token not found in response:', tokenData);
            return;
        }
        
        console.log('✅ Token obtained successfully!');
        
        // Step 2: Try APIs
        const endpoints = [
            {
                name: 'Logistics REST (rates subdomain)',
                url: `https://rates.searates.com/api/v2/rates?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
                method: 'GET'
            },
            {
                name: 'Logistics REST (api subdomain)',
                url: `https://api.searates.com/v2/rates?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
                method: 'GET'
            }
        ];
        
        for (const api of endpoints) {
            console.log(`\n📡 Step 2: Trying ${api.name}...`);
            try {
                const res = await fetch(api.url, {
                    method: api.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: api.body
                });
                
                console.log(`Status: ${res.status}`);
                const data = await res.json();
                
                if (res.ok) {
                    console.log(`✅ SUCCESS with ${api.name}!`);
                    console.log(JSON.stringify(data, null, 2));
                } else {
                    console.log(`❌ ${api.name} failed:`, data);
                }
            } catch (err) {
                console.log(`❌ ${api.name} fetch error: ${err.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testSeaRatesWithToken().catch(console.error);

