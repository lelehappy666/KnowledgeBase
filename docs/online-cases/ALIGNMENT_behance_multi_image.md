# ALIGNMENT: Behance Multi-Image Selection

## 1. 需求分析
用户指出 Behance 封面图解析不稳定（可能遇到视频等情况），要求改为：
**“把 Module 0, Module 1, Module 2 里面的所有图片都列出来，然后用户自己选择封面图”**。
此功能目前仅针对 Behance 平台。

## 2. 技术方案

### 后端 (Parser)
1.  **接口变更**: 更新 `ParsedCaseData` 接口，增加 `images?: string[]` 字段，用于传递候选图片列表。
2.  **BehanceParser**:
    *   保留 Puppeteer 解析逻辑。
    *   不再只寻找“第一张”图片，而是遍历前 3-5 个 `project-module-container`。
    *   提取其中所有有效的图片 (`src`)。
    *   将这些图片存入 `images` 数组。
    *   `coverImage` 默认设置为 `images[0]` (如果有)。

### 前端 (UI)
1.  **AddCaseDialog**:
    *   在解析成功后，如果返回的数据中包含 `images` 数组且长度 > 1。
    *   在封面图预览区域下方（或替代它）显示一个“候选图片”网格。
    *   用户点击网格中的图片，将其设置为当前的 `coverImage`。

## 3. 验收标准
*   解析 Behance 链接后，前端能显示多张图片供选择。
*   默认选中第一张。
*   点击其他图片能切换封面。
*   其他平台（如 Mana）不受影响。
