// Direct SeaRates API Test
// Tests the actual SeaRates API with your credentials

const testSeaRatesAPI = async () => {
    console.log('🧪 Testing SeaRates API Directly\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const origin = 'Shanghai';
    const destination = 'Los Angeles';
    
    // Try different possible API endpoints
    const endpoints = [
        `https://api.searates.com/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
        `https://www.searates.com/api/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
        `https://api.searates.com/rate-management/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
    ];
    
    console.log('📡 Testing SeaRates API endpoints...\n');
    console.log(`Platform ID: ${platformId}`);
    console.log(`API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`Route: ${origin} → ${destination}\n`);
    
    for (let i = 0; i < endpoints.length; i++) {
        const url = endpoints[i];
        console.log(`\nTest ${i + 1}: ${url.split('?')[0]}`);
        console.log('─'.repeat(60));
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
            
            const text = await response.text();
            console.log(`Response length: ${text.length} bytes`);
            
            if (response.ok) {
                try {
                    const data = JSON.parse(text);
                    console.log('\n✅ SUCCESS! API Response:');
                    console.log(JSON.stringify(data, null, 2));
                    
                    // Try to extract rate information
                    if (data.rates && Array.isArray(data.rates)) {
                        console.log(`\n📊 Found ${data.rates.length} rate(s):`);
                        data.rates.forEach((rate, idx) => {
                            console.log(`   Rate ${idx + 1}:`, {
                                price: rate.price || rate.rate || 'N/A',
                                currency: rate.currency || 'N/A',
                                carrier: rate.carrier || rate.carrier_name || 'N/A',
                                transit: rate.transit_time || rate.transit_days || 'N/A',
                            });
                        });
                    } else if (data.data) {
                        console.log('\n📊 Rate Data:', data.data);
                    } else if (data.price || data.rate) {
                        console.log('\n📊 Rate:', {
                            price: data.price || data.rate,
                            currency: data.currency,
                            carrier: data.carrier,
                        });
                    }
                    
                    console.log('\n✅ This endpoint works! Use this URL in your code.');
                    return; // Success, stop testing other endpoints
                } catch (parseError) {
                    console.log('⚠️  Response is not JSON:', text.substring(0, 200));
                }
            } else {
                console.log(`❌ Error response: ${text.substring(0, 200)}`);
            }
        } catch (error) {
            console.log(`❌ Request failed: ${error.message}`);
        }
    }
    
    console.log('\n\n💡 Next Steps:');
    console.log('   1. Check which endpoint format SeaRates uses for your plan');
    console.log('   2. Verify API key authentication method (query param vs header)');
    console.log('   3. Check SeaRates documentation for your specific API version');
    console.log('   4. Update lib/rates.ts with the correct endpoint format');
};

// Run test
testSeaRatesAPI().catch(console.error);

