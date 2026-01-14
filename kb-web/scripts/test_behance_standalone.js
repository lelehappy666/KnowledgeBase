const cheerio = require('cheerio');

// --- Mock Test Data V11: User's Full HTML Snippet ---
const MOCK_HTML_V11 = `
<!DOCTYPE html>
<html>
<body>
  <div class="Project-title-Q6Q">Mock V11 Project</div>
  
  <section class="Project-projectModuleContainer-BtF Preview__project--topMargin project-module-container" aria-label="Project Module 0">
    <div class="Module-module-Bce root module-container-reference">
        <div class="js-project-module js-project-module--image project-module module image project-module-image image-full project-module-image-full Image-root-d82">
            <div class="project-module-image-inner-wrap js-module-container-reference Image-container-z3a" tabindex="0">
                <!-- Actions... -->
            </div>
            <a class="ImageElement-root-kir ImageElement-blockPointerEvents-Rkg ImageElement-loaded-icR" href="/gallery/230549548/INSPIRE-LE-SAPCE-REFLECTING-SEA/modules/1327989389" aria-label="项目模块 1327989389 永久链接">
                <img 
                    width="1400" 
                    height="524" 
                    style="max-width:100%;height:auto;" 
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/8e1f5f230549548.688b2784693ac.png" 
                    srcset="https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/8e1f5f230549548.688b2784693ac.png 1.00x, https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/8e1f5f230549548.688b2784693ac.png 1.00x" 
                    alt="new media Media Art surealism 3d motion graphics 3d motion wonderland 3d art 3D" 
                    loading="eager" 
                    class="ImageElement-image-SRv" 
                    fetchpriority="high"
                >
            </a>
        </div>
    </div>
    <div class="spacer module-separator"><div class="divider"></div></div>
  </section>
</body>
</html>
`;

// --- Parser Logic (Mirrors BehanceParser V11) ---
async function parseHtml(html, sourceUrl) {
  const $ = cheerio.load(html);
  let title = $('.Project-title-Q6Q').text().trim() || 'Untitled';
  let coverImage = '';
  let coverSourceType = 'Not Found';

  if (!coverImage) {
      // Strategy V11: Robust First Image Module
      // 1. Find all project module containers
      const modules = $('section.project-module-container');
      
      // 2. Iterate to find the first one with a valid image
      modules.each((i, el) => {
          if (coverImage) return; // already found

          const module = $(el);
          // Check if this module has the ImageElement wrapper
          // We use class selector .ImageElement-root-kir as it seems unique to image modules
          const imgWrapper = module.find('.ImageElement-root-kir');
          
          if (imgWrapper.length > 0) {
              const img = imgWrapper.find('img').first();
              const src = img.attr('src');
              
              if (src) {
                  coverImage = src;
                  coverSourceType = `Static Image (V11 First Module Found: Index ${i})`;
              }
          }
      });
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
    console.log('--- Testing V11 Robust Strategy ---');
    const result = await parseHtml(MOCK_HTML_V11, 'mock://behance-v11');
    console.log(JSON.parse(result.content).rawDescription);

    const expected = 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/8e1f5f230549548.688b2784693ac.png';
    if (result.coverImage === expected) {
        console.log('✅ V11 Test Passed');
    } else {
        console.error(`❌ V11 Test Failed. Expected: ${expected}, Got: ${result.coverImage}`);
    }
}

run();
