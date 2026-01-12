# ALIGNMENT_behance_analysis

## 1. 项目背景
项目是一个知识库系统 (Next.js + Prisma)，目前支持解析“在线案例”。
现有解析器位于 `kb-web/src/lib/parsers/`。
API 端点是 `kb-web/src/app/api/online-cases/parse/route.ts`。

## 2. 需求 (本次更新 - 修复封面解析 V6 - 终极版)

### 2.1 任务描述
根据用户提供的包含完整 `section` 结构的 HTML 示例，精确修复 Behance 封面解析。

### 2.2 输入
- **URL**: 有效的 Behance 项目链接。
- **HTML 样本**: 包含 `section.Project-projectModuleContainer-BtF.Preview__project--topMargin` 的结构。

### 2.3 输出 (`ParsedCaseData`)
- **title**: 从 `.Project-title-Q6Q` 提取。
- **coverImage**: 
  - **策略 A (GIF/视频)**: 保持不变，查找 `[data-ut="project-module-source-original"]`。
  - **策略 B (静态图片 - 修正 V6)**: 
    - 1. **定位容器**: `section.Project-projectModuleContainer-BtF.Preview__project--topMargin` (精准定位首屏模块)。
    - 2. **查找图片**: 在该容器内查找 `img` 标签 (通常在 `.ImageElement-root-kir` 内，但直接找 img 更稳健)。
    - 3. **提取质量**: 解析 `srcset` 属性。
        - **关键升级**: 同时支持 `w` (宽度) 和 `x` (像素密度) 描述符。
        - 优先选择 `fs_webp` (Full Size) 或最大倍率/宽度的图片。
- **content**: 包含 `rawDescription` 调试报告。

### 2.4 解析逻辑 (用户指定修复)
- **Container**: `section.Preview__project--topMargin` (这代表 Top Margin，即第一个模块)。
- **Target**: `img` inside container.
- **Srcset**: Handle `1.00x`, `1.37x`, etc. to pick the best quality.

## 3. 共识
- 修改 `BehanceParser` 类。
- 缩小查找范围至 Top Section，避免选中页面下方的其他图片。
- 增强 `srcset` 解析器。
