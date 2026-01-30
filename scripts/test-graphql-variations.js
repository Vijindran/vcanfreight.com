// SeaRates GraphQL Discovery Script
const testGraphQLVariations = async () => {
    console.log('🧪 Discovering SeaRates GraphQL Structure\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    
    // Step 1: Get Token
    const tokenUrl = `https://www.searates.com/auth/platform-token?id=${platformId}&api_key=${apiKey}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    const token = tokenData['s-token'];
    
    const queries = [
        {
            name: 'Final attempt to find fields',
            query: `query { 
                rates(
                    pointIdFrom: "CNSHA", 
                    pointIdTo: "USLAX", 
                    shippingType: FCL
                ) { 
                    id
                    total_price
                    total_amount
                    currency
                    carrier {
                        name
                    }
                } 
            }`
        }
    ];
    
    for (const q of queries) {
        console.log(`\n📡 Testing: ${q.name}`);
        try {
            const res = await fetch('https://rates.searates.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: q.query })
            });
            
            const data = await res.json();
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.log(`❌ Error: ${e.message}`);
        }
    }
};

testGraphQLVariations().catch(console.error);

