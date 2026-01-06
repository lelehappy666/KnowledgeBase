# 🏛️ Exhibit Knowledge Base | 展品展项全链路知识库

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/license-Private-red)

> **沉淀创意、工程实现与科学原理的数字资产管理系统**
> 
> 专为策展人、工程师和科普工作者设计，支持从 **趋势洞察** 到 **工程落地** 的全生命周期管理。

---

## ✨ 核心愿景 (Vision)

本项目旨在构建一个**可生长**的展品知识体系，解决传统展品资料散乱、复用率低、评价标准不统一的痛点。通过结构化数据与非结构化文档的深度融合，实现：

*   🚀 **创意加速**: 快速检索成熟展项类型与前沿趋势。
*   ⚖️ **科学评价**: 基于多维度（体验、理解、科学性、工程、创新）的量化评分体系。
*   🧩 **模块复用**: 沉淀标准化工程模块与成本数据。

## 📦 功能模块 (Modules)

### 1. 🧠 认知基础库 (Cognitive Base)
构建展品认知的底层逻辑与分类体系。

*   **📈 趋势洞察 (Trends)**: 追踪 AI、空间计算等前沿技术在科普领域的应用趋势。
*   **🗂️ 展项类型 (Types)**: 标准化的展项分类定义（交互方式、内容类型、体验类型）。
*   **⭐ 评价体系 (Evaluation)**: 
    *   **六维雷达图**: 体验感、理解度、科学性、维护性、创新性、复用性。
    *   **JSON 模板化**: 支持评价模板的快速导入与复用。
    *   **成本估算**: 基于历史数据的成本区间分析。

### 2. 🎨 内容与叙事 (Content & Narrative)
*   **科学原理**: 关联展项背后的科学原理与学科知识点（K12 对齐）。
*   **主题库**: 沉淀常用的叙事主题与策展逻辑。

### 3. 🛠️ 工程与资产 (Engineering & Assets)
*   **多媒体管理**: 深度集成 NAS/本地存储，支持 **4K 视频**、**高清图片** 及 **GLB/GLTF 3D 模型** 在线预览。
*   **技术文档**: 存储技术实现方案、BOM 表、部署手册。

---

## 🛠️ 技术架构 (Tech Stack)

本项目采用现代化的全栈架构，确保高性能、易维护与离线部署能力。

| Layer | Technology | Highlights |
|-------|------------|------------|
| **Framework** | **Next.js 16** | App Router, Server Actions, Turbopack |
| **Language** | **TypeScript** | 全类型安全保障 |
| **Styling** | **Tailwind CSS v4** | 现代 CSS 引擎, OKLCH 色域支持 |
| **UI Kit** | **Shadcn/UI** | 优雅、可定制的组件库 (Radix UI) |
| **Database** | **SQLite + Prisma** | 轻量级、零配置、易迁移 |
| **Storage** | **File System / NAS** | 直接操作物理文件，适合大文件存储 |

---

## 🚀 快速开始 (Getting Started)

### 环境要求
*   Node.js 18+
*   现代浏览器 (Chrome/Edge/Safari)

### 1. 安装与初始化
```bash
# 克隆项目 (假设在本地)
cd kb-web

# 安装依赖
npm install

# 初始化数据库
npx prisma generate
npx prisma migrate dev --name init
```

### 2. 启动开发环境
```bash
npm run dev
```
访问 `http://localhost:3000` 开启探索之旅。

### 3. 生产环境部署 (离线支持)
```bash
npm run build
npm start
```

---

## 📂 目录结构 (Structure)

```text
e:\KnowledgeBase\
├── 📂 Doc/                  # 核心知识库存储 (Markdown/JSON)
│   ├── 📂 Trends/           # 趋势模块数据
│   └── ...
├── 📂 kb-web/               # Web 应用程序
│   ├── 📂 prisma/           # 数据库模型
│   ├── 📂 public/           # 静态资源
│   ├── 📂 src/
│   │   ├── 📂 app/          # Next.js 路由 (App Router)
│   │   ├── 📂 components/   # React 组件 (Atomic Design)
│   │   ├── 📂 lib/          # 核心逻辑 (FS操作, DB连接)
│   │   └── ...
│   └── 📂 uploads/          # 媒体资源上传目录 (可挂载NAS)
└── ...
```

## 📝 存储策略说明

系统采用 **双模存储策略** 以平衡性能与灵活性：

1.  **结构化数据 (SQLite)**: 用户账户、标签索引、文件元数据等高频检索信息。
2.  **非结构化知识 (File System)**: 
    *   `Doc/`: 存储核心知识文档（Markdown）和配置（JSON），**数据即文件**，方便备份与迁移。
    *   `uploads/`: 存储大体积媒体文件，支持直接挂载 NAS 网络存储。

---

Copyright © 2026 Exhibit Knowledge Base Team.
