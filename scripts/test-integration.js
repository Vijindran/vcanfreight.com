// Corrected SeaRates API Test
const testSeaRatesIntegration = async () => {
    console.log('🧪 Testing SeaRates Integration Logic\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    
    try {
        // Step 1: Get Token
        console.log('🔑 Step 1: Getting Bearer Token...');
        const tokenUrl = `https://www.searates.com/auth/platform-token?id=${platformId}&api_key=${apiKey}`;
        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();
        const token = tokenData['s-token'];
        
        if (!token) {
            console.error('❌ Token fetch failed:', tokenData);
            return;
        }
        console.log('✅ Token obtained!');
        
        // Step 2: Try GraphQL with correct args
        console.log('\n📡 Step 2: Trying GraphQL with correct arguments...');
        const gqlRes = await fetch('https://rates.searates.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                    query { 
                        rates(
                            pointIdFrom: "CNSHA", 
                            pointIdTo: "USLAX", 
                            shippingType: FCL
                        ) { 
                            __typename
                        } 
                    }
                `
            })
        });
        
        const gqlData = await gqlRes.json();
        console.log('GraphQL Response:', JSON.stringify(gqlData, null, 2));
        
        if (gqlData.data?.rates) {
            console.log('\n✅ SUCCESS! GraphQL is working.');
        } else {
            console.log('\n❌ GraphQL failed, but auth worked.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testSeaRatesIntegration().catch(console.error);

