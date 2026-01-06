# 项目开发规范 (Development Guidelines)

## 1. 服务端口
*   **开发服务器端口**: 始终优先使用 `3000` 端口。
*   **访问地址**: `http://localhost:3000`

## 2. 数据存储规则 (File System Based)
### A. 展品数据 (Exhibits)
*   **根目录**: `Doc/`
*   **结构**: `Doc/{展品名称}/data.json`

### B. 展品展项认知基础库 (Cognitive Library)
*   **根目录**: `Doc/Trends/`
*   **模块划分**:
    1.  **展项趋势洞察库**: `Doc/Trends/Module1_Trends/`
        *   文件命名: `{趋势名称}.json`
    2.  **展项类型体系**: `Doc/Trends/Module2_Types/` (规划中)
    3.  **展项评价体系**: `Doc/Trends/Module3_Evaluation/` (规划中)

## 3. 业务逻辑变更
*   **趋势数据录入**: 必须将文件保存在对应的模块子目录下，文件名与趋势名称保持一致。若修改名称，需同步重命名文件。

## 4. 路由结构
*   `/cognitive`: 认知基础库首页
*   `/cognitive/trends`: 趋势列表
*   `/cognitive/trends/[id]`: 趋势详情
*   `/admin/trends/create`: 新建趋势
*   `/admin/trends/[id]/edit`: 编辑趋势
