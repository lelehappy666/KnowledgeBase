# TASK: 展品知识库开发任务清单

## 1. 基础架构 (Infrastructure)
- [ ] **Task 1.1**: 初始化 Next.js 14 项目 (App Router, TypeScript, Tailwind).
- [ ] **Task 1.2**: 安装并配置 Shadcn/UI (Button, Input, Form, Card, Table, Dialog).
- [ ] **Task 1.3**: 初始化 Prisma + SQLite，定义 `schema.prisma` 并执行迁移。
- [ ] **Task 1.4**: 配置本地文件存储工具类 (Storage Utility)，确保能读写指定目录。

## 2. 后端核心 (Backend Logic)
- [ ] **Task 2.1**: 实现 `uploadFile` Server Action (接收 FormData -> 存盘 -> 写库 -> 返回 Asset).
- [ ] **Task 2.2**: 实现 `createExhibit` / `updateExhibit` Server Action (处理 JSON metadata).
- [ ] **Task 2.3**: 实现文件访问 API `GET /api/file/[id]` (Stream file content).

## 3. 前端 - 管理后台 (Admin UI)
- [ ] **Task 3.1**: 展品列表页 (DataTable, 分页, 筛选).
- [ ] **Task 3.2**: 展品编辑页 - 基础信息表单 (Title, Category, Tags).
- [ ] **Task 3.3**: 展品编辑页 - 多媒体上传组件 (支持预览上传后的图片/视频).
- [ ] **Task 3.4**: 展品编辑页 - 复杂元数据编辑器 (可以使用简单的 JSON Editor 或分块表单).

## 4. 前端 - 访客展示 (Visitor UI)
- [ ] **Task 4.1**: 首页/画廊页 (Grid 布局, 搜索栏, 筛选侧边栏).
- [ ] **Task 4.2**: 展品详情页 - 布局设计 (左侧多媒体，右侧信息).
- [ ] **Task 4.3**: 集成 3D 模型查看器 (`@react-three/fiber` + `useGLTF`).
- [ ] **Task 4.4**: 视频播放器集成.

## 5. 验证与交付 (Verify)
- [ ] **Task 5.1**: 录入一条完整测试数据 (包含 3D 模型和 PDF 中的评分数据).
- [ ] **Task 5.2**: 验证离线环境下的图片/视频加载速度.
