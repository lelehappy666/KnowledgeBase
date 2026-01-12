# TODO_behance_analysis

## 1. Bot Protection Handling
- **Issue**: Behance/Adobe blocks simple `fetch` requests (returns generic "Behance" title and no content).
- **Recommendation**:
    -   Use a headless browser (Puppeteer/Playwright) for parsing if live fetching is required on the server side.
    -   Or use a proxy service.
    -   Or have the client (browser) fetch the HTML and send it to the API (if CORS allows or via extension).

## 2. Class Name Stability
- **Issue**: The provided class names (`Project-title-Q6Q`) seem to be generated (CSS Modules). They might change frequently.
- **Recommendation**: Monitor parsing success rates. If they drop, update selectors to be more generic (e.g., `h1` for title, specific structure for cover) or rely more on Open Graph tags.
