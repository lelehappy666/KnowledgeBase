import * as cheerio from 'cheerio';
import { CaseParser, ParsedCaseData } from './base';
// Import puppeteer directly (it will be bundled by Next.js server-side)
import puppeteer from 'puppeteer';

export class BehanceParser implements CaseParser {
  canParse(url: string): boolean {
    return url.includes('behance.net');
  }

  async parse(url: string): Promise<ParsedCaseData> {
    try {
      console.log(`[BehanceParser] Fetching: ${url}`);
      let html = '';
      let fetchMethod = 'Puppeteer (Headless Chrome)'; // Default assumption

      // 1. Try Puppeteer first (Best for Behance Anti-Scraping)
      try {
          console.log('[BehanceParser] Attempting Puppeteer render...');
          const browser = await puppeteer.launch({
              headless: true, // Use boolean true instead of 'new' to satisfy type definition
              args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          const page = await browser.newPage();
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          
          // Go to URL and wait for network idle to ensure modules load
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
          
          // Auto-scroll to trigger lazy loading
          console.log('[BehanceParser] Auto-scrolling to load all modules...');
          await page.evaluate(async () => {
              await new Promise<void>((resolve) => {
                  let totalHeight = 0;
                  const distance = 100;
                  const timer = setInterval(() => {
                      const scrollHeight = document.body.scrollHeight;
                      window.scrollBy(0, distance);
                      totalHeight += distance;

                      if (totalHeight >= scrollHeight) {
                          clearInterval(timer);
                          resolve();
                      }
                  }, 100);
              });
          });

          // Wait a bit more for lazy loaded images to render
          await new Promise(r => setTimeout(r, 2000));

          // Optional: Wait for specific selector if known
          try {
              await page.waitForSelector('#project-modules', { timeout: 5000 });
          } catch (e) {
              // Ignore timeout, maybe page structure is different
          }

          html = await page.content();
          await browser.close();
          console.log(`[BehanceParser] Puppeteer success. HTML Length: ${html.length}`);
      } catch (pError) {
          console.error('[BehanceParser] Puppeteer failed:', pError);
          fetchMethod = `Fetch API (Puppeteer Failed: ${pError instanceof Error ? pError.message : String(pError)})`;
          // Fallback to fetch if Puppeteer fails
      }

      // 2. Fallback to Standard Fetch
      if (!html) {
          console.log('[BehanceParser] Falling back to standard Fetch...');
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
          });

          if (!response.ok) {
            throw new Error(`Behance returned ${response.status}`);
          }
          html = await response.text();
      }

      const $ = cheerio.load(html);

      // 1. Title
      let title = $('.Project-title-Q6Q').text().trim();
      if (!title) {
        title = $('meta[property="og:title"]').attr('content') || 
                $('title').text().trim() || 
                'Untitled Behance Project';
      }

      // 2. Cover Image Logic (V14 - Collect Multiple Images)
      let coverImage = '';
      let coverSourceType = 'Not Found';
      const candidateImages: string[] = [];

      // Strategy: Scan all project modules (limit to first 5-10 to save time/bandwidth)
      // and collect all valid images.
      const scanModules = $('section.project-module-container');
      
      scanModules.each((i, el) => {
          // Limit to first 10 modules to avoid excessive processing
          if (i > 10) return;

          const module = $(el);
          const imgWrapper = module.find('.ImageElement-root-kir');
          
          if (imgWrapper.length > 0) {
              const img = imgWrapper.find('img').first();
              const src = img.attr('src');
              
              if (src) {
                  candidateImages.push(src);
              }
          }
      });

      // Default to the first found image
      if (candidateImages.length > 0) {
          coverImage = candidateImages[0];
          coverSourceType = `Static Image (V14: Found ${candidateImages.length} candidates)`;
      }

      // Fallback: Open Graph Image
      if (!coverImage || coverImage.includes('spacer')) {
          const ogImage = $('meta[property="og:image"]').attr('content');
          if (ogImage) {
              // Add OG image to candidates if not already present
              if (!candidateImages.includes(ogImage)) {
                  candidateImages.push(ogImage);
              }
              if (!coverImage) {
                  coverImage = ogImage;
                  coverSourceType = 'Open Graph Fallback';
              }
          }
      }

      // 3. Description (No detail content requested)
      const description = "暂无描述";

      // Extract project modules HTML for custom display
      // User Request: Only keep sections with aria-label="Project Module 0" ... "Project Module N"
      const contentModules = $('section[aria-label^="Project Module"]');
      let projectModulesHtml = '';

      if (contentModules.length > 0) {
          // Create a wrapper to hold the cleaned modules
          const wrapper = $('<div></div>');
          
          contentModules.each((i, el) => {
              const module = $(el).clone(); // Clone to avoid modifying original DOM
              
              // Clean up scripts/styles/tools within the module
              module.find('script').remove();
              module.find('style').remove();
              module.find('.js-project-module-tools').remove();
              module.find('.js-module-tools').remove();
              module.find('.ui-toolbar').remove();
              module.find('.spacer').remove(); // Remove spacers
              module.find('.ImageElement-placeholder-Cz6').remove(); // Remove lazy-load placeholders
              module.find('svg').remove(); // Remove SVGs (icons, etc)
              module.find('.project-module__actions').remove(); // Remove overlay action buttons
              module.find('.project-module__action').remove();
              
              // V20: Remove vertical gaps between modules
              module.css('margin-bottom', '0');
              module.css('padding-bottom', '0');
              module.find('.project-module').css('margin-bottom', '0');

              // V20: Force Full Width for Video Embeds
              // Remove max-width/max-height constraints on embed containers
              module.find('.embed-dimensions').removeAttr('style').attr('style', 'width: 100%; margin: 0 auto;');
              
              // FILTER: Only keep module if it contains visual media (img, video, iframe)
              if (module.find('img, video, iframe').length === 0) {
                  return; // Skip text-only or empty modules
              }

              // Handle Lazy Loading: Swap data-src/srcset to src if src is spacer
              module.find('img').each((j, imgEl) => {
                  const img = $(imgEl);
                  const src = img.attr('src');
                  const dataSrc = img.attr('data-src') || img.attr('srcset')?.split(' ')[0];
                  
                  if ((!src || src.includes('spacer') || src.includes('blank')) && dataSrc) {
                      img.attr('src', dataSrc);
                      img.removeAttr('srcset');
                  }
                  
                  // Optimize Layout: Remove fixed dimensions to allow natural flow
                  // But DO NOT force width: 100% to preserve grid/centered layouts
                  img.removeAttr('width');
                  img.removeAttr('height');
                  
                  // Preserve original style if it exists, otherwise set defaults
                  // We only force display: block to avoid inline-block spacing issues
                  // but we respect width/height/max-width from original CSS if possible.
                  // For grid layouts, Behance uses specific widths on parent containers or imgs.
                  
                  // Reset style but keep necessary responsive rules
                  // V19: If image is inside a grid-item-container, we MUST keep its width: 100% to fill the flex container
                  // The flex container itself (parent) handles the width distribution.
                  if (img.closest('.js-grid-item-container').length > 0) {
                      img.attr('style', 'width: 100%; height: auto; display: block;');
                  } else {
                      // Standalone images
                      img.attr('style', 'max-width: 100%; height: auto; display: block;');
                  }
              });

              // V19: Handle Grid Layouts
              // Behance uses .js-grid-main (flex container) and .js-grid-item-container (flex items)
              // We need to ensure these styles are preserved or simulated.
              const gridMain = module.find('.js-grid-main');
              if (gridMain.length > 0) {
                  // Ensure container is flex
                  gridMain.attr('style', 'display: flex; flex-wrap: wrap; justify-content: space-between;');
                  
                  // Ensure items respect their flex-grow or width
                  gridMain.find('.js-grid-item-container').each((k, itemEl) => {
                      const item = $(itemEl);
                      // Behance puts style="width: ...; flex-grow: ..." inline. We should keep it!
                      // But we need to make sure we didn't strip it.
                      // If inline style is missing, we might need to rely on data attributes (data-width/data-flex-grow) if available,
                      // but usually cloning preserves inline styles.
                      
                      // Fix: Sometimes 'width' is pixel based which might break on smaller screens.
                      // Convert pixel width to percentage if possible or just rely on flex-grow.
                      // However, simplest fix for "row layout" is ensuring display: flex on parent (done above).
                  });
              }

              wrapper.append(module);
          });
          
          projectModulesHtml = wrapper.html() || '';
      }

      // 4. Generate Debug Info
      const debugInfo = `
【Behance 解析调试报告】
--------------------------------
1. 解析模式: ${fetchMethod}
2. 解析标题: ${title}
3. 封面图来源: ${coverSourceType}
4. 候选图片数: ${candidateImages.length}
5. 原始链接: ${url}
6. HTML长度: ${html.length} 字符
--------------------------------
      `.trim();

      // 5. Raw Content
      const content = JSON.stringify({
        rawTitle: title,
        rawCover: coverImage,
        rawDescription: debugInfo,
        scrapedAt: new Date().toISOString(),
        images: candidateImages, // Store in content for debugging/reference
        projectModulesHtml: projectModulesHtml
      });

      console.log(`[BehanceParser] Parsed: ${title}, Images: ${candidateImages.length}`);

      return {
        title,
        description,
        coverImage,
        content,
        platform: 'BEHANCE',
        sourceUrl: url,
        images: candidateImages // Pass to frontend
      };

    } catch (error) {
      console.error('Error parsing Behance URL:', error);
      throw new Error('Failed to parse Behance URL: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
