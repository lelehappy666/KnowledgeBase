const cheerio = require('cheerio');
const https = require('https');

// --- Helper: Fetch URL ---
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
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
    
    console.log(`\n--- Fetching Live URL: ${LIVE_URL} ---`);
    try {
        const { statusCode, data } = await fetchUrl(LIVE_URL);
        console.log(`Status Code: ${statusCode}`);
        console.log(`HTML Length: ${data.length}`);
        
        const $ = cheerio.load(data);
        
        // 1. Check Title
        const title = $('.Project-title-Q6Q').text().trim() || $('title').text().trim();
        console.log(`Title Found: "${title}"`);

        // 2. Check OG Tags (Fallback)
        const ogImage = $('meta[property="og:image"]').attr('content');
        console.log(`OG Image Found: ${ogImage || 'No'}`);

        // 3. Check JSON State (Hidden Data)
        // Behance often puts data in window.__INITIAL_STATE__
        const scriptContent = $('script').map((i, el) => $(el).html()).get().join('\n');
        const hasInitialState = scriptContent.includes('window.__INITIAL_STATE__');
        console.log(`Found window.__INITIAL_STATE__: ${hasInitialState}`);

        if (hasInitialState) {
            const match = scriptContent.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
            if (match) {
                console.log('Successfully extracted JSON State!');
                try {
                    const json = JSON.parse(match[1]);
                    // Try to find modules in JSON
                    if (json.project && json.project.modules) {
                        console.log(`JSON State contains ${json.project.modules.length} modules.`);
                        const firstImgMod = json.project.modules.find(m => m.type === 'image' || (m.components && m.components.find(c => c.type === 'image')));
                        if (firstImgMod) {
                            console.log('Found Image Module in JSON:', JSON.stringify(firstImgMod).substring(0, 100) + '...');
                        }
                    }
                } catch (e) {
                    console.log('Error parsing JSON state:', e.message);
                }
            }
        }

        // 4. Check DOM for User's Path
        const container = $('section.project-module-container');
        console.log(`Found ${container.length} project-module-containers in DOM.`);
        
        if (container.length > 0) {
            const firstMod = container.first();
            console.log('First Module HTML:', firstMod.html().substring(0, 200));
        } else {
            console.log('DOM containers not found. Likely Client-Side Rendered or Blocked.');
        }

    } catch (e) {
        console.error('Fetch Failed:', e.message);
    }
}

run();
