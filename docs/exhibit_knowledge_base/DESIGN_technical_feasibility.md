# DESIGN: 技术可行性数据库 (Technical Feasibility Database)

## 1. 背景说明
用户提供的参考文件 `e:\KnowledgeBase\技术可行性数据库.xlsx` 内容存在大量复制自"叙事与主题库"的错误信息（如"叙事结构"、"情感体验"等字段）。
基于模块名称"技术可行性数据库"及仅有的正确表头"技术风险评估基础"，本项目将采用符合通用的技术工程可行性评估的数据模型进行开发。

## 2. 目录结构
```
e:\KnowledgeBase\kb-web\
├── Doc\
│   └── Technical_Engineering\      # 新增根目录
│       └── Technical_Feasibility\  # 技术可行性数据库
│           └── {Name}.json
├── src\
│   ├── lib\
│   │   └── technical-system.ts     # 新增技术系统逻辑
│   ├── app\
│   │   ├── actions\
│   │   │   └── technical-feasibility.ts
│   │   └── technical\              # 新增路由组
│   │       └── feasibility\
│   │           ├── page.tsx
│   │           ├── create\
│   │           │   └── page.tsx
│   │           └── [id]\
│   │               ├── page.tsx
│   │               └── edit\
│   │                   └── page.tsx
│   └── components\
│       └── technical\
│           ├── technical-feasibility-form.tsx
│           └── technical-feasibility-import-dialog.tsx
```

## 3. 数据结构 (TypeScript Interface)

```typescript
export interface TechnicalFeasibility {
  id: string;
  name: string; // 技术方案名称
  updatedAt: string;
  
  // 1. 基础信息 (Basic Info)
  basic: {
    id: string; // TECH_...
    category: string; // 视觉/机械/软件/集成...
    description: string;
    keywords: string[];
    source: string; // 自研/采购/开源
  };

  // 2. 技术规格 (Specifications)
  specs: {
    dimensions: string; // 尺寸
    weight: string; // 重量
    power: string; // 功耗
    materials: string[]; // 材质
    network: string; // 网络需求
    software: string; // 软件环境
  };

  // 3. 可行性评估 (Feasibility Analysis)
  analysis: {
    maturity: {
      trl: number; // 技术成熟度 (1-9)
      status: string; // 商业化/实验室/概念
      cases: number; // 成功案例数
    };
    stability: {
      mtbf: string; // 平均无故障时间
      durability: string; // 耐久性
      maintenanceCycle: string; // 维护周期
    };
    safety: {
      risks: string[]; // 潜在风险
      measures: string[]; // 防护措施
      certifications: string[]; // 所需认证 (CCC/CE)
    };
    riskLevel: 'Low' | 'Medium' | 'High'; // 综合风险等级
  };

  // 4. 实施要求 (Implementation)
  requirements: {
    environment: {
      temperature: string;
      humidity: string;
      lighting: string;
      noise: string;
    };
    installation: {
      space: string;
      loadBearing: string;
      difficulty: number; // 1-5
      time: string; // 实施周期
    };
    skill: {
      development: string[]; // 开发技能
      operation: string[]; // 操作技能
    };
  };

  // 5. 成本估算 (Cost Estimation)
  cost: {
    development: number; // 研发成本
    hardware: number; // 硬件成本
    software: number; // 软件成本
    deployment: number; // 实施成本
    maintenance: number; // 年维护成本
    total: number;
  };

  // 6. 交互与体验 (Interaction) - 简化的技术视角
  interaction: {
    input: string[]; // 传感器/输入设备
    output: string[]; // 显示/反馈设备
    latency: string; // 响应延迟
    throughput: string; // 并发人数
  };
}
```

## 4. UI 设计
- **列表页**: 展示技术名称、分类、成熟度(TRL)、风险等级。
- **详情页**: 使用 Tabs 分组（基础、规格、评估、实施、成本）。
- **导入**: 提供标准 JSON 模板（基于上述结构）。
