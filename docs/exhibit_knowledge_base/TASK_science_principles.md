# TASK: 科学原理库开发任务分解

## 1. 后端逻辑 (Backend)
- [ ] **Task 1.1**: 创建 `src/lib/content-system.ts`
    - 实现 `getAllSciencePrinciples`, `getSciencePrincipleById`, `saveSciencePrinciple`, `deleteSciencePrinciple`。
    - 确保目录结构 `Doc/Content_Knowledge/Science_Principles/` 自动创建。
- [ ] **Task 1.2**: 创建 Server Actions `src/app/actions/science-principle.ts`
    - 实现 `createSciencePrincipleAction`, `updateSciencePrincipleAction`, `deleteSciencePrincipleAction`。
    - 处理 FormData 解析与 JSON 转换。

## 2. 前端组件 (Components)
- [ ] **Task 2.1**: 定义 TypeScript 类型 `SciencePrinciple` (在 `lib/content-system.ts` 中导出)。
- [ ] **Task 2.2**: 创建导入/导出组件 `src/components/content/science-principle-import-dialog.tsx`
    - 支持 JSON 粘贴导入。
    - 支持复制标准模板 JSON。
- [ ] **Task 2.3**: 创建表单组件 `src/components/content/science-principle-form.tsx`
    - 使用 Tabs 分组 7 大模块。
    - 集成 Shadcn UI 组件 (Input, Textarea, Select, Checkbox, Slider 等)。

## 3. 页面实现 (Pages)
- [ ] **Task 3.1**: 创建列表页 `src/app/content/science-principles/page.tsx`
    - 展示原理列表，支持新建、导入、搜索。
- [ ] **Task 3.2**: 创建详情/编辑页 `src/app/content/science-principles/[id]/page.tsx`
    - 展示详情，提供编辑入口。
    - 实现编辑模式。

## 4. 路由与导航
- [ ] **Task 4.1**: 更新导航栏 `src/components/layout/navbar.tsx` 或侧边栏，增加"科学原理库"入口。
