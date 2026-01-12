export interface ParsedCaseData {
  title: string;
  description: string;
  coverImage: string;
  content: string; // JSON string or HTML
  platform: string;
  sourceUrl: string;
}

export interface CaseParser {
  parse(url: string): Promise<ParsedCaseData>;
  canParse(url: string): boolean;
}
