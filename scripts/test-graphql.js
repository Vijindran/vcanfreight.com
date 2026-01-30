// Refined SeaRates GraphQL Test
const testGraphQL = async () => {
    console.log('🧪 Refining SeaRates GraphQL Test\n');
    
    const platformId = '29979';
    const apiKey = 'K-21EB16AA-B6A6-4D41-9365-5882597F9B11';
    const origin = 'Shanghai';
    const destination = 'Los Angeles';
    
    const authMethods = [
        { name: 'X-API-Key Header', headers: { 'X-API-Key': apiKey } },
        { name: 'Plain API Key in Auth Header', headers: { 'Authorization': apiKey } },
        { name: 'API Key in Query Param', url: `https://rates.searates.com/graphql?api_key=${apiKey}` },
        { name: 'Bearer with API Key', headers: { 'Authorization': `Bearer ${apiKey}` } }
    ];
    
    for (const method of authMethods) {
        console.log(`\nTesting: ${method.name}`);
        const url = method.url || 'https://rates.searates.com/graphql';
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(method.headers || {})
                },
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
                })
            });
            
            const data = await response.json();
            if (data.errors) {
                console.log(`❌ Error: ${data.errors[0].message}`);
            } else {
                console.log(`✅ SUCCESS!`, JSON.stringify(data, null, 2));
                return;
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
};

testGraphQL().catch(console.error);

