# TASK: Online Cases Module

## 1. Backend & Database
- [ ] **DB-01**: Update `schema.prisma` with `OnlineCase` model.
- [ ] **DB-02**: Run migration `npx prisma migrate dev`.

## 2. API Services
- [ ] **API-01**: Install `cheerio` for scraping.
- [ ] **API-02**: Implement `src/lib/parsers/base.ts` and `src/lib/parsers/mana.ts`.
- [ ] **API-03**: Create `src/app/api/online-cases/parse/route.ts`.
- [ ] **API-04**: Create `src/app/api/online-cases/route.ts` (GET, POST).
- [ ] **API-05**: Create `src/app/api/online-cases/[id]/route.ts` (GET).

## 3. Frontend - Basic
- [ ] **FE-01**: Add "在线案例" to `src/components/layout/navbar.tsx`.
- [ ] **FE-02**: Create `src/app/online-cases/page.tsx` (Skeleton).

## 4. Frontend - Add Case Flow
- [ ] **FE-03**: Create `src/components/online-cases/add-case-dialog.tsx`.
- [ ] **FE-04**: Implement Platform Selection (Step 1).
- [ ] **FE-05**: Implement URL Input & Parse Action (Step 2).
- [ ] **FE-06**: Implement Preview & Save (Step 3).

## 5. Frontend - Display
- [ ] **FE-07**: Implement `OnlineCaseCard` component.
- [ ] **FE-08**: Integrate List View in `src/app/online-cases/page.tsx`.
- [ ] **FE-09**: Create `src/app/online-cases/[id]/page.tsx` for details.
