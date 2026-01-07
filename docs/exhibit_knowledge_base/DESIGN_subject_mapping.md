# DESIGN: 学科对照库系统架构

## 1. 目录结构
```
e:\KnowledgeBase\kb-web\
├── Doc\
│   └── Content_Knowledge\
│       └── Subject_Mapping\        # 学科对照库
│           └── {Name}.json
├── src\
│   ├── lib\
│   │   └── content-system.ts       # 扩展支持 SubjectMapping
│   ├── app\
│   │   ├── actions\
│   │   │   └── subject-mapping.ts  # Server Actions
│   │   └── content\
│   │       └── subject-mappings\   # 路由
│   │           ├── page.tsx        # 列表页
│   │           ├── create\
│   │           │   └── page.tsx    # 新建页
│   │           └── [id]\
│   │               ├── page.tsx    # 详情页
│   │               └── edit\
│   │                   └── page.tsx # 编辑页
│   └── components\
│       └── content\
│           ├── subject-mapping-form.tsx    # 表单组件
│           └── subject-mapping-import-dialog.tsx # 导入组件
```

## 2. 数据结构 (TypeScript Interface)

```typescript
export interface SubjectMapping {
  id: string;
  name: string; // 条目名称
  updatedAt: string;
  
  // 1. 基础信息
  basic: {
    code: string;
    purpose: string; // 创建目的
  };

  // 2. 维度关联
  dimensions: {
    exhibit: {
      typeId: string; // 关联展项类型
      subTypes: string[];
      interaction: string[];
      experience: string[];
    };
    subject: {
      category: string; // 学科分类
      branch: string; // 学科分支
      topic: string; // 学科主题
      standard: string; // 课程标准
    };
    grade: {
      level: string; // 适用学段
      specific: string[]; // 具体年级
      ageRange: string;
      cognitiveLevel: string;
    };
  };

  // 3. 知识匹配
  knowledge: {
    principleId: string; // 关联知识点
    name: string;
    code: string;
    depth: string;
    type: string;
    match: {
      score: number; // 1-5
      reason: string;
      pros: string[];
      cons: string[];
      complementary: string[];
    };
  };

  // 4. 教学整合
  teaching: {
    timing: string;
    method: string[];
    duration: string;
    connection: string;
    difficulty: {
      cognitive: number;
      operation: number;
      threshold: string;
      skills: string[];
    };
    adaptability: {
      gender: string;
      culture: string;
      specialNeeds: string[];
      learningStyle: string[];
      personality: string[];
    };
    groupFit: {
      individual: number;
      group: number;
      class: number;
      family: number;
    };
  };

  // 5. 目标与评估
  goals: {
    knowledge: string[];
    ability: string[];
    literacy: string[];
    emotion: string[];
  };
  assessment: {
    dimensions: string[];
    methods: string[];
    tools: string;
    standards: any[]; // 表格
    performance: string;
  };
  outcome: {
    works: string[];
    example: string;
    display: string[];
  };

  // 6. 实施支持
  implementation: {
    conditions: {
      space: string;
      equipment: string[];
      personnel: string;
      safety: string;
      maintenance: string;
    };
    resources: {
      guide: string;
      manual: string;
      background: string;
      extended: any[]; // 链接
      qa: string;
    };
    schedule: {
      prep: number;
      activity: number;
      cleanup: number;
      bestTime: string[];
    };
    cost: {
      equipment: number;
      material: number;
      labor: number;
      total: number;
    };
  };

  // 7. 案例验证
  validation: {
    cases: string[]; // UUIDs
    schools: string[];
    dates: string[];
    report: string;
    feedback: {
      student: string;
      teacher: string;
      effect: any[]; // 表格
      engagement: number;
      satisfaction: number;
    };
    improvement: {
      history: any[]; // 版本记录
      todos: string[];
      suggestions: string;
    };
    status: {
      level: string;
      agency: string;
      date: string;
      report: string;
    };
  };
}
```

## 3. 核心流程
与科学原理库完全一致，复用 `content-system.ts` 中的文件操作逻辑（需泛型化或增加对应函数）。

## 4. UI 设计
- **Form**: 同样使用 Tabs 分组（基础维度、知识匹配、教学整合、目标评估、实施支持、案例验证）。
- **Import**: 提供标准 JSON 模板，支持直接编辑和导入。
