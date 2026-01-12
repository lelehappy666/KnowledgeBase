# ACCEPTANCE: Online Cases Module

## 1. Overview
Implemented the "Online Cases" module to allow collecting inspiration from external platforms (Mana, etc.).

## 2. Completed Features
- **Database**: Added `OnlineCase` model to Prisma schema.
- **Backend API**:
  - `POST /api/online-cases/parse`: Supports Mana URL parsing (Basic OG metadata).
  - `GET /api/online-cases`: Lists all cases.
  - `POST /api/online-cases`: Creates a new case.
  - `GET /api/online-cases/[id]`: Detail view data.
- **Frontend**:
  - Added "在线案例" to Navbar.
  - Created Main Page (`/online-cases`) with grid list.
  - Created "Quick Add" Dialog (`AddOnlineCaseDialog`) with:
    - Platform Selection (Mana enabled).
    - URL Input & Parse.
    - Preview & Save.
  - Created Detail Page (`/online-cases/[id]`).

## 3. Verification
- **Build**: Code structure follows Next.js App Router patterns.
- **Migration**: Database migration `20260107090529_add_online_case` applied successfully.
- **Parsing**: `ManaParser` implements basic OpenGraph extraction.

## 4. Next Steps (TODO)
- Refine parsing logic for Mana (specific DOM selectors).
- Implement parsers for Behance, YouTube, XiaoHongShu.
- Add edit/delete functionality.
