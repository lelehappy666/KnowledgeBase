# DESIGN: 展品知识库系统架构

## 1. 系统架构图 (System Architecture)

```mermaid
graph TD
    User[用户/策展人] -->|HTTP/Browser| NextJS[Next.js App Server]
    
    subgraph "Frontend (Client)"
        UI[UI Components (Shadcn)]
        Three[3D Viewer (R3F)]
        Player[Video Player]
    end
    
    subgraph "Backend (Server Actions)"
        Auth[Auth Module]
        CMS[Content Management]
        FileHandler[File Handler]
    end
    
    subgraph "Data Layer"
        SQLite[(SQLite Database)]
        NAS[NAS / Local Storage]
    end
    
    NextJS --> UI
    NextJS --> Auth
    NextJS --> CMS
    NextJS --> FileHandler
    
    CMS -->|Prisma ORM| SQLite
    FileHandler -->|Node.js FS| NAS
```

## 2. 数据库设计 (Schema Design)

使用 Prisma + SQLite。

### 核心模型
1.  **User**: 管理员账户
2.  **Exhibit**: 展品核心实体
3.  **Asset**: 多媒体资源
4.  **Category**: 分类维表
5.  **Tag**: 标签

```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Hashed
  createdAt DateTime @default(now())
}

model Exhibit {
  id          String   @id @default(uuid())
  title       String
  description String?  // 简述
  content     String?  // 详细介绍 (Rich Text)
  
  // 核心属性
  status      String   @default("draft") // draft, published, archived
  
  // 复杂元数据 (JSON) - 对应 PDF 中的 A/B/C/D 维度
  // 包含: trends(趋势), evaluation(评价), principles(原理), engineering(工程), cost(成本)
  metadata    String   @default("{}") 
  
  // 关联
  assets      Asset[]
  categories  Category[]
  tags        Tag[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Asset {
  id        String   @id @default(uuid())
  name      String
  path      String   // 物理路径 (e.g., E:\NAS\images\1.jpg)
  type      String   // IMAGE, VIDEO, MODEL_3D, DOCUMENT
  mimeType  String?
  size      Int?
  
  exhibitId String?
  exhibit   Exhibit? @relation(fields: [exhibitId], references: [id])
  
  createdAt DateTime @default(now())
}

model Category {
  id        String    @id @default(uuid())
  name      String
  type      String    // INTERACTION(交互方式), CONTENT(内容类型), EXPERIENCE(体验类型)
  exhibits  Exhibit[]
}

model Tag {
  id        String    @id @default(uuid())
  name      String    @unique
  exhibits  Exhibit[]
}
```

## 3. 接口与数据流

### 3.1 文件上传流
1.  用户在前端选择文件 (Image/Video/GLB)。
2.  调用 Server Action `uploadFile(formData)`.
3.  服务器将文件写入配置的 `STORAGE_ROOT` (NAS路径)。
4.  服务器在 SQLite `Asset` 表创建记录。
5.  返回 Asset ID 给前端。

### 3.2 资源访问流
由于 NAS 路径不在 Web 根目录，需通过 API 代理：
*   **API**: `GET /api/file/[assetId]`
*   **Logic**: 查库获取 `path` -> `fs.createReadStream(path)` -> Pipe to Response。
*   **Cache**: 设置适当的 Cache-Control 头。

## 4. 目录结构规划
```
e:\KnowledgeBase\
  ├── prisma/
  │   └── schema.prisma
  ├── public/
  ├── src/
  │   ├── app/
  │   │   ├── (admin)/        # 后台管理路由
  │   │   ├── (public)/       # 访客路由
  │   │   └── api/
  │   │       └── file/       # 文件流代理
  │   ├── components/
  │   │   ├── exhibit/        # 展品相关组件
  │   │   └── ui/             # Shadcn组件
  │   ├── lib/
  │   │   ├── db.ts           # Prisma Client
  │   │   └── storage.ts      # 文件操作封装
  │   └── actions/            # Server Actions
  ├── uploads/                # 默认本地存储 (可配置为NAS路径)
  ├── next.config.js
  └── package.json
```

## 5. 关键技术选型
*   **3D Viewer**: `@react-three/fiber` + `@react-three/drei` (需验证离线安装依赖是否顺利，如果离线环境无法 npm install，需确保开发环境已下载所有依赖并打包 `node_modules`，或者当前环境是有网的，开发完再拷贝过去)。*注: 假设当前开发环境有网。*
