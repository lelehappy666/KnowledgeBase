import * as cheerio from 'cheerio';
import { CaseParser, ParsedCaseData } from './base';

export class ManaParser implements CaseParser {
  canParse(url: string): boolean {
    return url.includes('manamana.net') || url.includes('mana');
  }

  /**
   * Extracts the full detail text, preserving paragraph structure.
   */
  private extractFullDetail(html: string): string {
    if (!html) return "";
    
    const $ = cheerio.load(html, { decodeEntities: true });

    // 1. Remove non-visible elements
    $('script, style, meta, link, iframe').remove();

    // 2. Handle Line Breaks: Replace <br> with newline
    $('br').replaceWith('\n');

    // 3. Handle Block Elements: Insert newlines after block elements
    $('p, div, li, tr, h1, h2, h3, h4, h5, h6').after('\n\n');

    // 4. Extract text
    let text = $.text();

    // 5. Cleanup
    return text
        .replace(/\n\s*\n/g, '\n\n') // Collapse multiple newlines to double newline
        .trim();
  }

  /**
   * Extracts the short description (preview) - text before the first <br>.
   */
  private extractPreviewDescription(html: string): string {
    if (!html) return "";

    // 1. Split by first <br> tag (case insensitive)
    // We use a regex to find the first occurrence of <br>, <br/>, <br />
    const brRegex = /<br\s*\/?>/i;
    const parts = html.split(brRegex);
    
    // Take the first part
    let firstPart = parts[0];

    // 2. Clean up the HTML in this first part
    const $ = cheerio.load(firstPart, { decodeEntities: true });
    $('script, style, meta, link, iframe').remove();
    
    return $.text().trim();
  }

  async parse(url: string): Promise<ParsedCaseData> {
    try {
      // 1. Extract Video ID
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('id');
      
      if (!videoId) {
         const match = url.match(/[?&]id=(\d+)/);
         if (match) {
             videoId = match[1];
         }
      }

      if (!videoId) {
          throw new Error('Could not extract video ID from Mana URL');
      }

      // 2. Fetch Data from API
      const apiUrl = `https://www.manamana.net/api/video/detail?videoId=${videoId}`;
      console.log(`[ManaParser] Fetching API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Mana API returned ${response.status}`);
      }

      const json = await response.json();
      const data = json.data;

      if (!data) {
          throw new Error('No data found in Mana API response');
      }

      // 3. Map Data
      const title = data.title || 'Untitled Case';
      
      // Video URL extraction
      let videoUrl = data.url || '';
      if (!videoUrl && data.qiniuData) {
          try {
              const qiniu = typeof data.qiniuData === 'string' ? JSON.parse(data.qiniuData) : data.qiniuData;
              if (qiniu && qiniu.resource) {
                  const resourceKey = qiniu.resource.s1080 || qiniu.resource.s720 || qiniu.resource.s480;
                  if (resourceKey) {
                      videoUrl = `https://video.manamana.net/${resourceKey}`;
                  }
              }
          } catch (e) {
              console.warn('Failed to parse qiniuData', e);
          }
      }
      
      // Description: Parse HTML in 'introduction'
      let fullDescription = "";
      let shortDescription = "";
      let rawSource = ""; // To store what we actually used (HTML or Text)

      if (data.introduction) {
          console.log("[ManaParser] Parsing introduction HTML...");
          fullDescription = this.extractFullDetail(data.introduction);
          shortDescription = this.extractPreviewDescription(data.introduction);
          rawSource = data.introduction;
      } else if (data.introductionText) {
          console.log("[ManaParser] Using introductionText...");
          fullDescription = data.introductionText;
          // Split by newline for short description
          const parts = fullDescription.split('\n');
          shortDescription = parts[0] || "";
          rawSource = data.introductionText;
      } else if (data.summary) {
          fullDescription = data.summary;
          shortDescription = data.summary;
          rawSource = data.summary;
      } else {
          // Fallback: Try to fetch the page HTML if API data is missing
          try {
            console.log("[ManaParser] API missing description, fetching page HTML...");
            const pageRes = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (pageRes.ok) {
                const pageHtml = await pageRes.text();
                const $ = cheerio.load(pageHtml);
                const introContent = $('.intro-content').html();
                
                if (introContent) {
                    console.log("[ManaParser] Found .intro-content in page HTML");
                    fullDescription = this.extractFullDetail(introContent);
                    shortDescription = this.extractPreviewDescription(introContent);
                    rawSource = introContent;
                }
            }
          } catch (e) {
              console.warn("[ManaParser] Failed to fetch page HTML fallback", e);
          }
      }
      
      console.log(`[ManaParser] Extracted Description Length: ${fullDescription.length}`);
      
      if (!shortDescription) {
          shortDescription = "暂无描述";
      }
      
      // Cover Image
      let coverImage = '';
      if (data.images && data.images.length > 0) {
          coverImage = data.images[0];
      } else if (data.thumb) {
          if (data.thumb.startsWith('http')) {
              coverImage = data.thumb;
          } else {
              coverImage = `https://image.manamana.net/${data.thumb}`;
          }
      }

      // Store full raw data for future reference
      const content = JSON.stringify({
        rawTitle: title,
        rawDescription: fullDescription, // Store full text here for Detail Page
        videoUrl,
        rawHtml: rawSource, // Store the raw source we found (HTML or Text)
        apiData: data,
        scrapedAt: new Date().toISOString()
      });

      return {
        title,
        description: shortDescription, // Short summary for list/card
        coverImage,
        content,
        platform: 'MANA',
        sourceUrl: url
      };
    } catch (error) {
      console.error('Error parsing Mana URL:', error);
      throw new Error('Failed to parse Mana URL: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
