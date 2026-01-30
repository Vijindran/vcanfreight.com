// Test script for SeaRates API
// Run with: node test-rates.js

const testRates = async () => {
    console.log('🧪 Testing VCANFreight Backend & SeaRates API\n');
    
    const baseUrl = 'http://localhost:3000';
    const testOrigin = 'Shanghai';
    const testDestination = 'Los Angeles';
    
    try {
        // Test 1: Basic rates endpoint
        console.log('Test 1: Testing rates endpoint...');
        const testUrl = `${baseUrl}/api/rates/test?origin=${encodeURIComponent(testOrigin)}&destination=${encodeURIComponent(testDestination)}`;
        
        const response = await fetch(testUrl);
        const data = await response.json();
        
        console.log('\n✅ Response received:');
        console.log(JSON.stringify(data, null, 2));
        
        // Analyze results
        console.log('\n📊 Analysis:');
        console.log(`   Status: ${data.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`   Rate Source: ${data.rate?.source || 'unknown'}`);
        console.log(`   Price: ${data.rate?.price || 'N/A'} ${data.rate?.currency || ''}`);
        console.log(`   Carrier: ${data.rate?.carrier || 'N/A'}`);
        console.log(`   Cache Status: ${data.cacheStatus || 'Unknown'}`);
        console.log(`   API Configured: ${data.apiStatus?.apiKeyConfigured ? '✅ Yes' : '❌ No'}`);
        
        if (data.rate?.source === 'mock') {
            console.log('\n⚠️  Using mock data - API not called or cache not available');
        } else if (data.rate?.source === 'cached') {
            console.log('\n✅ Using cached rate - No API call needed (saves quota)');
        } else if (data.rate?.source === 'life') {
            console.log('\n✅ Using life rate - May be from cache or fresh API call');
        }
        
        // Test 2: Check if server is running
        console.log('\n\nTest 2: Checking server health...');
        try {
            const healthResponse = await fetch(`${baseUrl}/api/rates/test?origin=test&destination=test`);
            console.log('✅ Server is running and responding');
        } catch (err) {
            console.log('❌ Server not responding:', err.message);
        }
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   1. Dev server is running: npm run dev');
        console.log('   2. Server is accessible at http://localhost:3000');
        console.log('   3. API routes are properly configured');
    }
};

// Run test
testRates();

