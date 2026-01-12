const cheerio = require('cheerio');
const https = require('https');

// --- Mock Test Data 1: GIF Case ---
const MOCK_HTML_GIF = `
<!DOCTYPE html>
<html>
<body>
  <div class="Project-title-Q6Q">Mock GIF Project</div>
  <img data-ut="project-module-source-original" srcset="https://example.com/gif-small.gif 300w, https://example.com/gif-large.gif 1000w" />
</body>
</html>
`;

// --- Mock Test Data 4: V7 Static Case (User's Latest Example) ---
const MOCK_HTML_V7 = `
<!DOCTYPE html>
<html>
<body>
  <div class="Project-title-Q6Q">Mock V7 Project</div>
  
  <section class="Project-projectModuleContainer-BtF Preview__project--topMargin project-module-container" aria-label="Project Module 0">
    <div class="Module-module-Bce root module-container-reference">
      <div class="js-project-module js-project-module--image project-module module image project-module-image image-full project-module-image-full Image-root-d82">
        <div class="project-module-image-inner-wrap js-module-container-reference Image-container-z3a" tabindex="0">
           <!-- Actions... -->
        </div>
        <a class="ImageElement-root-kir ImageElement-blockPointerEvents-Rkg ImageElement-loaded-icR" href="/gallery/230549548/INSPIRE-LE-SAPCE-REFLECTING-SEA/modules/1327989389">
          <img 
            width="1400" 
            height="524" 
            src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/8e1f5f230549548.688b2784693ac.png" 
            srcset="
              https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/8e1f5f230549548.688b2784693ac.png  1.00x, 
              https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/8e1f5f230549548.688b2784693ac.png  1.00x, 
              https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8e1f5f230549548.688b2784693ac.png  1.00x" 
            alt="new media Media Art" 
            class="ImageElement-image-SRv"
          >
        </a>
      </div>
    </div>
    <div class="spacer module-separator"><div class="divider"></div></div>
  </section>
</body>
</html>
`;

// --- Parser Logic (Mirrors BehanceParser V7 Candidate) ---
async function parseHtml(html, sourceUrl) {
  const $ = cheerio.load(html);
  let title = $('.Project-title-Q6Q').text().trim() || 'Untitled';
  let coverImage = '';
  let coverSourceType = 'Not Found';

  // Strategy A: GIF
  const gifElement = $('[data-ut="project-module-source-original"]');
  if (gifElement.length > 0) {
      const srcset = gifElement.attr('srcset');
      if (srcset) {
         const sources = srcset.split(',').map(s => {
             const parts = s.trim().split(/\s+/);
             return { url: parts[0], width: parseInt((parts[1] || '0w').replace(/\D/g, ''), 10) || 0 };
         });
         sources.sort((a, b) => b.width - a.width);
         if (sources.length > 0) {
             coverImage = sources[0].url;
             coverSourceType = `GIF Srcset (${sources[0].width}w)`;
         }
      }
  }

  // Strategy B: V7 - Specific Section + .ImageElement-root-kir
  if (!coverImage) {
      const container = $('section.Project-projectModuleContainer-BtF.Preview__project--topMargin');
      
      if (container.length > 0) {
           // Refined Selector: Find .ImageElement-root-kir inside the section, then the img inside that
           const img = container.find('.ImageElement-root-kir img').first();
           
           if (img.length > 0) {
               const srcset = img.attr('srcset');
               const src = img.attr('src');

               if (srcset) {
                   const sources = srcset.split(',').map(s => {
                       const parts = s.trim().split(/\s+/);
                       const url = parts[0];
                       const descriptor = parts[1] || '1x'; 
                       
                       let score = 0;
                       
                       // Prioritize fs_webp (Full Size)
                       if (url.includes('/fs_webp/')) score += 100000;
                       // Prioritize 1400_webp
                       if (url.includes('/1400_webp/')) score += 50000;
                       // Prioritize max_632 (User's src match)
                       if (url.includes('/max_632_webp/')) score += 10000;

                       if (descriptor.endsWith('w')) {
                           score += parseInt(descriptor, 10) || 0;
                       } else if (descriptor.endsWith('x')) {
                           const density = parseFloat(descriptor) || 1;
                           score += density * 1000; 
                       }

                       return { url, score };
                   });

                   sources.sort((a, b) => b.score - a.score);
                   
                   if (sources.length > 0) {
                       coverImage = sources[0].url;
                       coverSourceType = 'Static Image (Section V7 Srcset)';
                   }
               }
               
               if (!coverImage && src) {
                   coverImage = src;
                   coverSourceType = 'Static Image (Section V7 Src)';
               }
           }
      }
  }

  // Fallback
  if (!coverImage) {
      const element = $('.ImageElement-root-kir.ImageElement-blockPointerEvents-Rkg');
      if (element.length > 0) {
           const firstImg = element.first().find('img');
           if (firstImg.length > 0) {
               coverImage = firstImg.attr('src');
               coverSourceType = 'Static Image (Fallback)';
           }
      }
  }

  const debugInfo = `
【Behance 解析调试报告】
--------------------------------
1. 解析标题: ${title}
2. 封面图来源: ${coverSourceType}
3. 封面图地址: ${coverImage || '未找到'}
--------------------------------
  `.trim();

  return { title, coverImage, content: JSON.stringify({ rawDescription: debugInfo }) };
}

// --- Main Execution ---
async function run() {
    console.log('--- Testing V7 Static Case ---');
    const v7Result = await parseHtml(MOCK_HTML_V7, 'mock://behance-v7');
    console.log(JSON.parse(v7Result.content).rawDescription);

    // We expect fs_webp if logic prioritizes quality, OR max_632 if we strictly follow "src"
    // Given the user asked for "parsing rule based on my example" where src was max_632, 
    // BUT usually high res is better. 
    // Let's see what the parser picks with current prioritization.
}

run();
