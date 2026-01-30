// Enhanced SeaRates API Test with different auth methods
const testSeaRatesAPI = async () => {
    console.log('🧪 Testing SeaRates API with Different Auth Methods\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const origin = 'Shanghai';
    const destination = 'Los Angeles';
    
    // Test different endpoint and auth combinations
    const tests = [
        {
            name: 'Query Param API Key',
            url: `https://api.searates.com/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' }
        },
        {
            name: 'Header X-API-Key',
            url: `https://api.searates.com/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            }
        },
        {
            name: 'Header Authorization Bearer',
            url: `https://api.searates.com/v2/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        },
        {
            name: 'Alternative Endpoint - Rate Management',
            url: `https://api.searates.com/rate-management/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' }
        },
        {
            name: 'Alternative Endpoint - V1',
            url: `https://api.searates.com/v1/rates?platform_id=${platformId}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&api_key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' }
        },
    ];
    
    console.log(`Platform ID: ${platformId}`);
    console.log(`API Key: ${apiKey.substring(0, 15)}...`);
    console.log(`Route: ${origin} → ${destination}\n`);
    
    for (const test of tests) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`Test: ${test.name}`);
        console.log(`URL: ${test.url.split('?')[0]}`);
        console.log('─'.repeat(70));
        
        try {
            const response = await fetch(test.url, {
                method: 'GET',
                headers: test.headers,
            });
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            
            const text = await response.text();
            
            if (response.ok) {
                try {
                    const data = JSON.parse(text);
                    console.log('\n✅ SUCCESS! API Response:');
                    console.log(JSON.stringify(data, null, 2));
                    console.log('\n🎉 This method works! Use this configuration.');
                    return { success: true, method: test.name, data };
                } catch (parseError) {
                    console.log('⚠️  Response is not JSON');
                    console.log('Response preview:', text.substring(0, 300));
                }
            } else {
                console.log(`❌ Error ${response.status}`);
                if (text.length < 500) {
                    console.log('Response:', text);
                } else {
                    console.log('Response preview:', text.substring(0, 300));
                }
            }
        } catch (error) {
            console.log(`❌ Request failed: ${error.message}`);
        }
    }
    
    console.log('\n\n📋 Summary:');
    console.log('   - Tested multiple endpoint formats');
    console.log('   - Tested different authentication methods');
    console.log('   - None of the standard formats worked');
    console.log('\n💡 Recommendations:');
    console.log('   1. Check SeaRates dashboard for your specific API endpoint');
    console.log('   2. Review SeaRates API documentation for Platform ID 29979');
    console.log('   3. Contact SeaRates support for correct endpoint format');
    console.log('   4. The API might require different parameters or format');
    
    return { success: false };
};

testSeaRatesAPI().catch(console.error);

