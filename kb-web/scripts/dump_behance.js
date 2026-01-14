const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Helper: Fetch URL ---
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
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
    const LIVE_URL = 'https://www.behance.net/gallery/230549548/INSPIRE-LE-SAPCE-REFLECTING-SEA';
    const OUT_FILE = path.join(__dirname, 'debug_behance_dump.html');
    
    console.log(`\n--- Fetching Live URL: ${LIVE_URL} ---`);
    try {
        const { statusCode, data } = await fetchUrl(LIVE_URL);
        console.log(`Status Code: ${statusCode}`);
        console.log(`HTML Length: ${data.length}`);
        
        fs.writeFileSync(OUT_FILE, data);
        console.log(`Saved HTML to ${OUT_FILE}`);
        
    } catch (e) {
        console.error('Fetch Failed:', e.message);
    }
}

run();
