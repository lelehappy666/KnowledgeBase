# TASK: Behance Multi-Image Selection

## 1. 接口更新
- [ ] **文件**: `kb-web/src/lib/parsers/base.ts`
- **内容**: `ParsedCaseData` 增加 `images?: string[];`

## 2. Parser 逻辑更新
- [ ] **文件**: `kb-web/src/lib/parsers/behance.ts`
- **内容**:
    - 修改 `parse` 方法。
    - 遍历 `$('section.project-module-container')` (Limit to first 5).
    - 提取每个模块中的图片 `src`。
    - 返回 `{ ..., images: [...] }`。

## 3. 前端 UI 更新
- [ ] **文件**: `kb-web/src/components/online-cases/add-case-dialog.tsx`
- **内容**:
    - 在表单状态中增加 `candidateImages`。
    - 在解析回调中，如果 `result.images` 存在，更新 `candidateImages`。
    - 在 UI 中渲染图片网格（ScrollArea + Grid）。
    - 点击图片 -> `form.setValue('coverImage', img)`。

## 4. 验证
- [ ] 运行测试脚本 `scripts/test_behance_standalone.js` (需更新以打印 images 列表)。
- [ ] 手动测试 UI 交互。
