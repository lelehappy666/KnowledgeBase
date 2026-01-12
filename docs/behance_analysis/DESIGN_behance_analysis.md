# DESIGN_behance_analysis

## 1. System Architecture
Integrate into the existing Parser strategy pattern.

- **Interface**: `CaseParser` (existing)
- **Implementation**: `BehanceParser`
- **Factory/Router**: Update `POST` handler in `route.ts` to switch on `platform === 'BEHANCE'`.

## 2. Class Design

### `BehanceParser`
- **Location**: `kb-web/src/lib/parsers/behance.ts`
- **Implements**: `CaseParser`

#### Methods
1.  `canParse(url: string): boolean`
    -   Return `true` if url contains `behance.net`.

2.  `parse(url: string): Promise<ParsedCaseData>`
    -   **Step 1**: Fetch page HTML.
        -   Headers: `User-Agent` (simulate browser).
    -   **Step 2**: Parse with `cheerio`.
    -   **Step 3**: Extract Data.
        -   **Title**: `$('.Project-title-Q6Q').text().trim()`
        -   **Cover**:
            -   Selector: `.Project-projectModuleContainer-BtF.Preview__project--topMargin.project-module-container img`
            -   Attribute: `src` (primary), fallback to `srcset` parsing if needed.
            -   *Note*: The user-provided class `Project-projectModuleContainer-BtF...` seems specific. I will use it as the root for finding the image.
    -   **Step 4**: Return object.
        -   `description`: "暂无描述"
        -   `content`: JSON string of raw data.

## 3. Data Flow
1.  User inputs URL in Frontend.
2.  Frontend sends POST to `/api/online-cases/parse` with `{ url, platform: 'BEHANCE' }`.
3.  API selects `BehanceParser`.
4.  Parser fetches and scrapes.
5.  Returns JSON to Frontend.

## 4. Error Handling
- Invalid URL / Network Error: Throw Error.
- Missing Elements (Title/Cover): Return default/empty values or throw if critical. (Will attempt to be resilient).
