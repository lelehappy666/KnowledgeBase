const https = require('https');

// --- Helper: Fetch URL ---
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'application/json'
            }
        };
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', (err) => reject(err));
    });
}

// --- Main Execution ---
async function run() {
    const PROJECT_URL = 'https://www.behance.net/gallery/230549548/INSPIRE-LE-SAPCE-REFLECTING-SEA';
    const OEMBED_URL = `https://www.behance.net/services/oembed?url=${encodeURIComponent(PROJECT_URL)}&format=json`;
    
    console.log(`\n--- Testing OEmbed: ${OEMBED_URL} ---`);
    try {
        const { statusCode, data } = await fetchUrl(OEMBED_URL);
        console.log(`Status Code: ${statusCode}`);
        console.log(`Data: ${data}`);
        
        try {
            const json = JSON.parse(data);
            console.log('\n--- Extracted Info ---');
            console.log(`Title: ${json.title}`);
            console.log(`Cover: ${json.thumbnail_url}`);
            console.log('----------------------');
        } catch (e) {
            console.log('Not valid JSON');
        }

    } catch (e) {
        console.error('Fetch Failed:', e.message);
    }
}

run();
