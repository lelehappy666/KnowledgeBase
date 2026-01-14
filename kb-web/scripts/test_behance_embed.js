const cheerio = require('cheerio');
const https = require('https');

// --- Helper: Fetch URL ---
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
    const ID = '230549548'; // From previous URL
    const EMBED_URL = `https://www.behance.net/embed/project/${ID}`;
    
    console.log(`\n--- Fetching Embed URL: ${EMBED_URL} ---`);
    try {
        const { statusCode, data } = await fetchUrl(EMBED_URL);
        console.log(`Status Code: ${statusCode}`);
        console.log(`HTML Length: ${data.length}`);
        
        const $ = cheerio.load(data);
        
        // 1. Check Title
        const title = $('.Project-title').text().trim() || $('title').text().trim();
        console.log(`Title Found: "${title}"`);

        // 2. Check Cover Image in Embed
        // Embed pages usually have a cover image in a simpler structure
        const cover = $('.Cover-cover-L5z img').attr('src') || 
                      $('.Project-cover img').attr('src') || 
                      $('img').first().attr('src');
                      
        console.log(`Cover Found: ${cover || 'No'}`);
        
        // Dump first image tag for inspection
        console.log('First Image Tag:', $('img').first().toString());

    } catch (e) {
        console.error('Fetch Failed:', e.message);
    }
}

run();
