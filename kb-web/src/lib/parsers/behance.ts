import * as cheerio from 'cheerio';
import { CaseParser, ParsedCaseData } from './base';

export class BehanceParser implements CaseParser {
  canParse(url: string): boolean {
    return url.includes('behance.net');
  }

  async parse(url: string): Promise<ParsedCaseData> {
    try {
      console.log(`[BehanceParser] Fetching: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        throw new Error(`Behance returned ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // 1. Title
      let title = $('.Project-title-Q6Q').text().trim();
      if (!title) {
        title = $('meta[property="og:title"]').attr('content') || 
                $('title').text().trim() || 
                'Untitled Behance Project';
      }

      // 2. Cover Image Logic
      let coverImage = '';
      let coverSourceType = 'Not Found'; // For debug info

      // Strategy A: Check for GIF (data-ut="project-module-source-original")
      const gifElement = $('[data-ut="project-module-source-original"]');
      if (gifElement.length > 0) {
          const srcset = gifElement.attr('srcset');
          if (srcset) {
             const sources = srcset.split(',').map(s => {
                 const parts = s.trim().split(/\s+/);
                 const url = parts[0];
                 const widthStr = parts[1] || '0w';
                 const width = parseInt(widthStr.replace(/\D/g, ''), 10) || 0;
                 return { url, width };
             });
             sources.sort((a, b) => b.width - a.width);
             if (sources.length > 0) {
                 coverImage = sources[0].url;
                 coverSourceType = `GIF Srcset (${sources[0].width}w)`;
             }
          }
      }

      // Strategy B: Check for Static Image (V7 - Specific Section + .ImageElement-root-kir)
      if (!coverImage) {
          // User provided specific container class
          const container = $('section.Project-projectModuleContainer-BtF.Preview__project--topMargin');
          
          if (container.length > 0) {
               // Refined Selector: Find .ImageElement-root-kir inside the section, then the img inside that
               const img = container.find('.ImageElement-root-kir img').first();
               
               if (img.length > 0) {
                   const srcset = img.attr('srcset');
                   const src = img.attr('src');

                   if (srcset) {
                       // Parse srcset which might contain 'x' (density) or 'w' (width)
                       const sources = srcset.split(',').map(s => {
                           const parts = s.trim().split(/\s+/);
                           const url = parts[0];
                           const descriptor = parts[1] || '1x'; // default to 1x if missing
                           
                           let score = 0;
                           
                           // Prioritize 'fs_webp' (Full Size)
                           if (url.includes('/fs_webp/')) score += 100000;
                           // Prioritize '1400_webp' (High Res)
                           if (url.includes('/1400_webp/')) score += 50000;
                           
                           // Parse descriptor
                           if (descriptor.endsWith('w')) {
                               score += parseInt(descriptor, 10) || 0;
                           } else if (descriptor.endsWith('x')) {
                               const density = parseFloat(descriptor) || 1;
                               score += density * 1000; 
                           }

                           return { url, score };
                       });

                       // Sort by score descending
                       sources.sort((a, b) => b.score - a.score);
                       
                       if (sources.length > 0) {
                           coverImage = sources[0].url;
                           coverSourceType = 'Static Image (Section V7 Srcset)';
                       }
                   }
                   
                   // Fallback to src if no srcset or empty
                   if (!coverImage && src) {
                       coverImage = src;
                       coverSourceType = 'Static Image (Section V7 Src)';
                   }
               }
          }
      }

      // Fallback Strategy: Old method (Direct Class Search) if V6 missed
      if (!coverImage) {
          const element = $('.ImageElement-root-kir.ImageElement-blockPointerEvents-Rkg');
          
          if (element.length > 0) {
               // element could be a collection if there are multiple images. 
               // We take the first one or iterate. Let's take the first valid image.
               
               // Check first match
               const firstImg = element.first().find('img');
               if (firstImg.length > 0) {
                   const src = firstImg.attr('src');
                   if (src) {
                       coverImage = src;
                       coverSourceType = 'Static Image (Direct Class V5)';
                   }
               }
          }
      }

      // Fallback: Open Graph Image
      if (!coverImage || coverImage.includes('spacer')) {
          const ogImage = $('meta[property="og:image"]').attr('content');
          if (ogImage) {
              coverImage = ogImage;
              coverSourceType = 'Open Graph Fallback';
          }
      }

      // 3. Description (No detail content requested)
      const description = "暂无描述";

      // 4. Generate Debug Info
      const debugInfo = `
【Behance 解析调试报告】
--------------------------------
1. 解析标题: ${title}
2. 封面图来源: ${coverSourceType}
3. 封面图地址: ${coverImage || '未找到'}
4. 原始链接: ${url}
--------------------------------
说明: 此内容仅供核对，保存后可在详情页编辑。
      `.trim();

      // 5. Raw Content
      const content = JSON.stringify({
        rawTitle: title,
        rawCover: coverImage,
        rawDescription: debugInfo,
        scrapedAt: new Date().toISOString()
      });

      console.log(`[BehanceParser] Parsed: ${title}`);

      return {
        title,
        description,
        coverImage,
        content,
        platform: 'BEHANCE',
        sourceUrl: url
      };

    } catch (error) {
      console.error('Error parsing Behance URL:', error);
      throw new Error('Failed to parse Behance URL: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
