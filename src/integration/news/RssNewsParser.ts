import type { INewsParser } from "@/core/ports/outgoing";
import type { ParsedNewsItem } from "@/core/entities";

export class RssNewsParser implements INewsParser {
  async parse(url: string): Promise<ParsedNewsItem[]> {
    try {
      const response = await fetch(url);
      const xml = await response.text();
      
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      
      return items.map(item => {
        const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
        const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
        const content = (item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
        const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
        
        return {title, url: link, content, publishedAt: new Date(pubDate)};
      });
    } catch (error) {
      console.error(`Failed to parse ${url}:`, error);
      return [];
    }
  }
}
