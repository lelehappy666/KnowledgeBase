export interface ParsedCaseData {
  title: string;
  description: string;
  coverImage: string;
  content: string; // JSON string or HTML
  platform: string;
  sourceUrl: string;
  images?: string[]; // Optional list of candidate images (e.g. for Behance)
}

export interface CaseParser {
  parse(url: string): Promise<ParsedCaseData>;
  canParse(url: string): boolean;
}
