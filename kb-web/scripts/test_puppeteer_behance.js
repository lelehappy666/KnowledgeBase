const puppeteer = require('puppeteer');

async function run() {
    const url = 'https://www.behance.net/gallery/230549548/INSPIRE-LE-SAPCE-REFLECTING-SEA';
    console.log(`Testing Puppeteer on: ${url}`);
    
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set User Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Go to URL
        console.log('Navigating...');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Wait for module container
        try {
            await page.waitForSelector('.project-module-container', { timeout: 10000 });
            console.log('Found .project-module-container');
        } catch (e) {
            console.log('Timeout waiting for selector');
        }

        const content = await page.content();
        console.log(`HTML Length: ${content.length}`);
        
        // Check for image
        if (content.includes('8e1f5f230549548.688b2784693ac.png')) {
            console.log('✅ Target image URL found in HTML!');
        } else {
            console.log('❌ Target image URL NOT found.');
        }

        await browser.close();
        
    } catch (e) {
        console.error('Puppeteer Error:', e);
    }
}

run();
