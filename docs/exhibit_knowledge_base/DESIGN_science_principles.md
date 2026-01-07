# DESIGN: 科学原理库系统架构

## 1. 目录结构
```
e:\KnowledgeBase\kb-web\
├── Doc\
│   └── Content_Knowledge\          # 展项内容知识库根目录
│       └── Science_Principles\     # 科学原理库
│           ├── 偏振光原理\
│           │   └── data.json
│           └── ...
├── src\
│   ├── lib\
│   │   └── content-system.ts       # 内容库核心逻辑 (FS操作)
│   ├── app\
│   │   ├── actions\
│   │   │   └── science-principle.ts # Server Actions
│   │   └── content\
│   │       └── science-principles\
│   │           ├── page.tsx        # 列表页
│   │           └── [id]\
│   │               ├── page.tsx    # 详情页
│   │               └── edit\
│   │                   └── page.tsx # 编辑页
│   └── components\
│       └── content\
│           ├── science-principle-form.tsx  # 表单组件
│           └── science-principle-import.tsx # 导入组件
```

## 2. 数据结构 (TypeScript Interface)

```typescript
export interface SciencePrinciple {
  id: string;
  name: string; // 原理名称
  updatedAt: string;
  
  // 1. 基础信息
  basic: {
    aliases: string[]; // 别名
    enName: string;
    icon?: string; // 资源ID或URL
    abstract: string;
    history: string; // Rich Text
  };

  // 2. 分类体系
  classification: {
    category: string; // 一级学科
    subCategory: string; // 二级学科
    crossDiscipline: string[];
    knowledgeSystem: string;
    difficultyLevel: string;
  };

  // 3. 教育与课程
  education: {
    gradeLevel: string[]; // 适用学段
    gradeSpecific: string[]; // 具体年级 (合并小/初/高)
    curriculum: {
      standard: any[]; // 课标条目
      requirements: string;
      knowledgePointId: string;
      coreLiteracy: string[];
      abilityGoals: string[];
      cognitiveLevel: string;
    };
    teaching: {
      misconceptions: string[];
      difficulties: string;
      suggestions: string;
      safety: string;
    };
  };

  // 4. 展项关联
  exhibitRelation: {
    exhibitability: string;
    suitableTypes: string[]; // UUIDs
    existingCases: string[]; // UUIDs
    creativeIdeas: any[]; // {name, desc}
    design: {
      visualStrategy: string;
      interactionPoints: string[];
      experiencePoints: string[];
      techPath: string[];
    };
    difficulty: {
      understanding: number; // 1-5
      operation: number;
      immersion: number;
      memory: number;
    };
  };

  // 5. 课程活动
  activity: {
    curriculum: {
      theme: string;
      type: string[];
      duration: string;
      location: string[];
      audienceSize: string;
    };
    project: {
      theme: string;
      cycle: string;
      drivingQuestion: string;
      outcome: string[];
      evaluationRubric: string; // File
    };
    resources: {
      ppt: string;
      guide: string;
      manual: string;
      video: string;
      materials: string; // File
      equipment: any[]; // {name, count}
      cost: number;
    };
  };

  // 6. 跨学科
  crossDisciplinary: {
    steam: {
      s: string[];
      t: string[];
      e: string[];
      a: string[];
      m: string[];
    };
    application: {
      daily: string[];
      industrial: string[];
      research: string[];
      medical: string[];
      military: string[];
    };
    frontier: {
      research: string;
      unsolved: string[];
      trends: string;
    };
  };

  // 7. 评估
  evaluation: {
    teaching: {
      indicators: string[];
      methods: string[];
      tools: string;
      data: any[];
    };
    exhibit: {
      effect: number; // 1-5
      feedback: string;
      suggestions: string;
    };
    content: {
      accuracy: string;
      timeliness: string;
      completeness: number;
      utility: number;
      popularity: number;
    };
  };
}
```

## 3. 核心流程
1.  **Read**: 扫描 `Doc/Content_Knowledge/Science_Principles/` 下所有目录，读取 `data.json`。
2.  **Create**: 接收 FormData 或 JSON -> 生成 UUID -> 创建目录 -> 写入 `data.json`。
3.  **Update**: 读取 -> Merge -> 写入。
4.  **Import**: 解析 JSON -> 校验 -> Create。

## 4. UI 设计
- **Form**: 使用 Tabs 分组 7 大模块，避免页面过长。
- **Import Dialog**: 提供 JSON 粘贴框，以及 "Copy Template" 按钮。
