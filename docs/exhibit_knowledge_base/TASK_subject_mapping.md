# TASK: 学科对照库开发任务分解

## 1. 后端逻辑 (Backend)
- [ ] **Task 1.1**: 更新 `src/lib/content-system.ts`
    - 定义 `SubjectMapping` 接口。
    - 实现 `getAllSubjectMappings`, `getSubjectMappingById`, `saveSubjectMapping`, `deleteSubjectMapping`。
    - 确保目录结构 `Doc/Content_Knowledge/Subject_Mapping/` 自动创建。
- [ ] **Task 1.2**: 创建 Server Actions `src/app/actions/subject-mapping.ts`
    - 实现 `createSubjectMappingAction`, `updateSubjectMappingAction`, `deleteSubjectMappingAction`。

## 2. 前端组件 (Components)
- [ ] **Task 2.1**: 创建导入组件 `src/components/content/subject-mapping-import-dialog.tsx`
    - 复用科学原理库的导入逻辑和样式。
    - 更新 `exampleJson` 为学科对照库的结构。
- [ ] **Task 2.2**: 创建表单组件 `src/components/content/subject-mapping-form.tsx`
    - 使用 Tabs 分组 6 大模块。
    - 字段对齐 Excel 结构。

## 3. 页面实现 (Pages)
- [ ] **Task 3.1**: 创建列表页 `src/app/content/subject-mappings/page.tsx`
    - 展示列表，支持新建。
- [ ] **Task 3.2**: 创建新建页 `src/app/content/subject-mappings/create/page.tsx`
    - 包含导入按钮和表单。
- [ ] **Task 3.3**: 创建详情/编辑页 `src/app/content/subject-mappings/[id]/page.tsx` 及 `edit/page.tsx`。

## 4. 路由更新
- [ ] **Task 4.1**: 更新 `src/app/content/page.tsx` 中的卡片链接，指向 `/content/subject-mappings`。
