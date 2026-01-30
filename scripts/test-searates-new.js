// Updated SeaRates API Test based on new documentation links
const testNewSeaRatesAPI = async () => {
    console.log('🧪 Testing NEW SeaRates API Endpoints\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const origin = 'Shanghai';
    const destination = 'Los Angeles';
    
    const tests = [
        {
            name: 'GraphQL Endpoint',
            url: 'https://rates.searates.com/graphql',
            method: 'POST',
            body: JSON.stringify({
                query: `
                    query {
                        rates(origin: "${origin}", destination: "${destination}") {
                            price
                            currency
                            carrier
                        }
                    }
                `
            }),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-API-Key': apiKey
            }
        },
        {
            name: 'Logistics V2 REST',
            url: `https://api.searates.com/logistics/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        },
        {
            name: 'RMS Available Rates',
            url: `https://api.searates.com/rms/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    ];
    
    for (const test of tests) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`Test: ${test.name}`);
        console.log(`URL: ${test.url}`);
        console.log('─'.repeat(70));
        
        try {
            const response = await fetch(test.url, {
                method: test.method,
                headers: test.headers,
                body: test.body
            });
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            
            if (response.ok) {
                try {
                    const data = JSON.parse(text);
                    console.log('✅ SUCCESS! Response:', JSON.stringify(data, null, 2));
                } catch (e) {
                    console.log('⚠️  Response is not JSON:', text.substring(0, 200));
                }
            } else {
                console.log(`❌ Error response: ${text.substring(0, 300)}`);
            }
        } catch (error) {
            console.log(`❌ Request failed: ${error.message}`);
        }
    }
};

testNewSeaRatesAPI().catch(console.error);

