<div align="center">

<h1>🏛️✨ Exhibit Knowledge Base</h1>
<strong>展品展项全链路知识库 · 趋势 × 叙事 × 技术 × 交付</strong>

<br/>

<img src="https://img.shields.io/badge/version-0.1.0-7F56D9?style=for-the-badge&logo=semanticrelease" />
<img src="https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" />
<img src="https://img.shields.io/badge/Private-Repo-F97316?style=for-the-badge&logo=github" />

<br/><br/>

<a href="#模块概览">📦 模块概览</a> •
<a href="#快速开始">🚀 快速开始</a> •
<a href="#站点导航">🗺️ 站点导航</a> •
<a href="#数据与存储">💾 数据与存储</a> •
<a href="#快速导入json">⚡ 快速导入</a>

</div>

---

## 模块概览
- 🧠 认知基础库：趋势洞察、展项类型、评价体系
- 🎨 内容与叙事：叙事主题、科学原理、学科对照
- 🛠️ 工程与技术：技术可行性数据库（新增）
- 🗂️ 媒资与文档：图片/视频/3D 模型、技术方案与手册
- 🖥️ 管理后台：统一创建、编辑、导入与运营看板

> 今日更新 · ✨
- 叙事主题新增「快速导入」（粘贴 JSON 秒建）
- 技术可行性数据库上线，支持「快速导入」
- 路由与导航统一：/cognitive、/content、/technical、/gallery、/admin

---

## 技术栈亮点
- ⚙️ Next.js 16 · App Router / Server Actions / Turbopack
- 🔤 TypeScript 全量类型安全
- 🎛️ Tailwind CSS v4 · 现代原子化样式
- 🧩 Shadcn/UI · 基于 Radix UI 的优雅组件
- 🗃️ SQLite + Prisma · 轻量结构化数据
- 💽 文件系统/NAS · JSON 知识与大文件友好

---

## 快速开始
- 环境准备：Node.js 18+
- 安装依赖

```bash
cd kb-web
npm install
```

- 初始化数据库

```bash
npx prisma generate
npx prisma migrate dev --name init
```

- 启动开发

```bash
npm run dev
```

- 生产部署

```bash
npm run build
npm start
```

---

## 站点导航
- 🧭 认知基础库
  - /cognitive/trends
  - /cognitive/types
  - /cognitive/evaluations
- 🎨 内容与叙事
  - /content/narrative-themes
  - /content/science-principles
  - /content/subject-mappings
- 🛠️ 工程与技术
  - /technical/feasibility
- 🖼️ 媒资图库
  - /gallery
- 🛡️ 管理后台
  - /admin

---

## 数据与存储
- 策略
  - SQLite：高频检索的结构化元数据
  - 文件系统：核心知识 JSON 与大体积媒资
- 目录约定
  - kb-web/Doc/Trends/Module1_Trends
  - kb-web/Doc/Trends/Module2_Types
  - kb-web/Doc/Trends/Module3_Evaluation
  - kb-web/Doc/Content_Knowledge/Narrative_Theme
  - kb-web/Doc/Content_Knowledge/Science_Principles
  - kb-web/Doc/Content_Knowledge/Subject_Mapping
  - kb-web/Doc/Technical_Engineering/Technical_Feasibility
  - kb-web/uploads

---

## 快速导入（JSON）
- 各模块创建页点击「快速导入」，粘贴 JSON 即可秒建
- 示例：技术可行性

```json
{
  "name": "全息投影技术方案",
  "basic": {
    "id": "TECH-VIS-001",
    "category": "视觉技术",
    "description": "基于佩珀尔幻像原理的3D全息展示系统",
    "keywords": ["全息", "3D", "佩珀尔幻像"],
    "source": "采购"
  },
  "specs": {
    "dimensions": "2m x 2m x 2m",
    "weight": "150kg",
    "power": "800W",
    "materials": ["钢化玻璃", "铝合金框架"],
    "network": "千兆以太网",
    "software": "Unity3D / UE5"
  },
  "analysis": {
    "maturity": { "trl": 9, "status": "商业成熟", "cases": 50 },
    "stability": { "mtbf": "5000小时", "durability": "高", "maintenanceCycle": "3个月" },
    "safety": {
      "risks": ["玻璃破碎风险"],
      "measures": ["使用钢化夹胶玻璃", "设置防护栏"],
      "certifications": ["CE", "CCC"]
    },
    "riskLevel": "Low"
  }
}
```

---

## 目录结构

```text
e:\KnowledgeBase\
├── kb-web/                  # Web 应用
│   ├── prisma/              # Prisma 模型与迁移
│   ├── public/              # 静态资源
│   ├── src/                 # 源码
│   │   ├── app/             # 路由与页面
│   │   ├── components/      # UI 与表单
│   │   ├── lib/             # 核心逻辑（FS、DB）
│   └── Doc/                 # JSON 知识库数据
└── README.md
```

---

## 开发规范
- 风格统一，复用现有组件与工具
- 提交前建议运行

```bash
npm run lint
```

---

## 版权
Copyright © 2026 Exhibit Knowledge Base Team
