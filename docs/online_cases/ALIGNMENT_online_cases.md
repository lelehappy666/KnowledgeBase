# ALIGNMENT: Online Cases Module

## 1. Context Analysis
- **Project**: Knowledge Base System (Next.js + Prisma + SQLite).
- **Existing Architecture**: 
  - `Exhibit` model for internal curated exhibits.
  - Navbar with specific sections (Cognitive, Content, Technical, etc.).
- **New Requirement**: "Online Cases" (在线案例) module to gather inspiration from external websites (Mana, Behance, YouTube, XiaoHongShu).

## 2. Requirements Understanding
- **Entry Point**: New link "在线案例" in the top navigation bar.
- **Main Page**: A grid/list of saved online cases.
- **Creation Flow**:
  1. Click "快速增加在线案例" (Quick Add) button.
  2. Modal opens -> Step 1: Select Source (Mana, Behance, YouTube, XiaoHongShu).
     - *Scope Constraint*: Only "Mana" is implemented in this phase.
  3. Step 2: Input URL.
  4. Action: Parse URL.
  5. Result: Create a new case card.
- **Detail View**: Clicking a card opens a detail page showing the parsed content.
- **Parsing**: Rules differ per website. (To be implemented with a strategy pattern).

## 3. Questions & Clarifications
- **Data Model**: Should `OnlineCase` be a separate model or part of `Exhibit`?
  - *Assumption*: Create a separate `OnlineCase` model to avoid coupling with the complex `Exhibit` metadata structure, as this is for external inspiration gathering.
- **Parsing Logic**: Since this is a client-side app (mostly), will parsing happen on the server (API route) or client?
  - *Decision*: Server-side (API route) is better to avoid CORS issues and handle scraping logic.
- **Storage**: Do we save the images locally or link to them?
  - *Assumption*: Store the URL initially. Downloading images might be complex (permissions, storage). We will store the `coverImage` URL.

## 4. Proposed Specification
- **URL Route**: `/online-cases`
- **API Routes**: 
  - `GET /api/online-cases` (List)
  - `POST /api/online-cases/parse` (Parse URL)
  - `POST /api/online-cases` (Save)
- **Database Model**:
  ```prisma
  model OnlineCase {
    id          String   @id @default(uuid())
    title       String
    description String?
    sourceUrl   String
    platform    String   // MANA, BEHANCE, YOUTUBE, XIAOHONGSHU
    coverImage  String?
    content     String?  // JSON or HTML content parsed
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  ```
