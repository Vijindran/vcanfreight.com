// Direct SeaRates API test script
// Run with: node test-searates-direct.js

async function run() {
    console.log('--- Searching for Point IDs using ports endpoint ---');
    const url = `https://www.searates.com/shipping/explorer/search/ports?q=shanghai`;
    
    try {
        const res = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

run();
