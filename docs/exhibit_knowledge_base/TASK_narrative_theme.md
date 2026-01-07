# TASK: 叙事与主题库开发任务分解

## 1. 后端逻辑 (Backend)
- [ ] **Task 1.1**: 更新 `src/lib/content-system.ts`
    - 定义 `NarrativeTheme` 接口。
    - 实现 `getAllNarrativeThemes`, `getNarrativeThemeById`, `saveNarrativeTheme`, `deleteNarrativeTheme`。
    - 确保目录结构 `Doc/Content_Knowledge/Narrative_Theme/` 自动创建。
- [ ] **Task 1.2**: 创建 Server Actions `src/app/actions/narrative-theme.ts`
    - 实现 `createNarrativeThemeAction`, `updateNarrativeThemeAction`, `deleteNarrativeThemeAction`。

## 2. 前端组件 (Components)
- [ ] **Task 2.1**: 创建导入组件 `src/components/content/narrative-theme-import-dialog.tsx`
    - 复用导入逻辑和样式。
    - 更新 `exampleJson` 为叙事与主题库的结构。
- [ ] **Task 2.2**: 创建表单组件 `src/components/content/narrative-theme-form.tsx`
    - 使用 Tabs 分组 6 大模块。
    - 字段对齐 Excel 结构。

## 3. 页面实现 (Pages)
- [ ] **Task 3.1**: 创建列表页 `src/app/content/narrative-themes/page.tsx`
    - 展示列表，支持新建。
- [ ] **Task 3.2**: 创建新建页 `src/app/content/narrative-themes/create/page.tsx`
    - 包含导入按钮和表单。
- [ ] **Task 3.3**: 创建详情/编辑页 `src/app/content/narrative-themes/[id]/page.tsx` 及 `edit/page.tsx`。

## 4. 路由更新
- [ ] **Task 4.1**: 更新 `src/app/content/page.tsx` 中的卡片链接，指向 `/content/narrative-themes`。
