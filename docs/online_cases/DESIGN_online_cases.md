# DESIGN: Online Cases Module

## 1. System Architecture

### 1.1 Database Design (Prisma)
New model `OnlineCase` to store external case data.

```prisma
model OnlineCase {
  id          String   @id @default(uuid())
  title       String
  description String?
  sourceUrl   String
  platform    String   // "MANA", "BEHANCE", "YOUTUBE", "XIAOHONGSHU"
  coverImage  String?
  content     String?  // Stored as JSON string or HTML depending on parsing result
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 1.2 API Design
- **GET /api/online-cases**: Fetch list of cases.
- **POST /api/online-cases/parse**: Parse a given URL based on platform.
  - Input: `{ url: string, platform: string }`
  - Output: `{ title: string, description: string, coverImage: string, content: any }`
- **POST /api/online-cases**: Create a new case (confirming the parsed data).
  - Input: `{ title, description, sourceUrl, platform, coverImage, content }`
- **GET /api/online-cases/[id]**: Get single case details.

### 1.3 Frontend Architecture
- **Page Structure**:
  - `/online-cases`: Grid layout of `OnlineCaseCard`.
  - `/online-cases/[id]`: Detail layout.
- **Components**:
  - `AddOnlineCaseDialog`: Manages the state of the wizard (Step 1 -> Step 2 -> Preview/Save).
  - `PlatformSelect`: UI for selecting the provider.
  - `UrlParserInput`: Input field + "Parse" button.
  - `ParsedCasePreview`: Shows the result before saving.

### 1.4 Parsing Logic (Server-Side)
- **Pattern**: Strategy Pattern.
- **Interface**: `CaseParser` { `parse(url: string): Promise<ParsedData>` }
- **Implementation**: `ManaParser` (Priority 1).
- **Fallback**: Generic metadata parser (OpenGraph tags) if specific parser fails or for future generic support.

## 2. Dependencies
- `cheerio` (for HTML parsing on server side).
- `axios` or `fetch` (for retrieving page content).
