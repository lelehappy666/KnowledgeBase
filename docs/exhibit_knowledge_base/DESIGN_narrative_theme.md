# DESIGN: 叙事与主题库系统架构

## 1. 目录结构
```
e:\KnowledgeBase\kb-web\
├── Doc\
│   └── Content_Knowledge\
│       └── Narrative_Theme\        # 叙事与主题库
│           └── {Name}.json
├── src\
│   ├── lib\
│   │   └── content-system.ts       # 扩展支持 NarrativeTheme
│   ├── app\
│   │   ├── actions\
│   │   │   └── narrative-theme.ts  # Server Actions
│   │   └── content\
│   │       └── narrative-themes\   # 路由
│   │           ├── page.tsx        # 列表页
│   │           ├── create\
│   │           │   └── page.tsx    # 新建页
│   │           └── [id]\
│   │               ├── page.tsx    # 详情页
│   │               └── edit\
│   │                   └── page.tsx # 编辑页
│   └── components\
│       └── content\
│           ├── narrative-theme-form.tsx    # 表单组件
│           └── narrative-theme-import-dialog.tsx # 导入组件
```

## 2. 数据结构 (TypeScript Interface)

```typescript
export interface NarrativeTheme {
  id: string;
  name: string; // 主题名称
  updatedAt: string;
  
  // 1. 主题基础信息
  basic: {
    id: string; // THEME_...
    aliases: string[];
    icon: string;
    color: string;
    slogan: string;
    abstract: string;
    attributes: {
      type: string; // 科学/人文...
      scale: string; // 大型...
      timeliness: string;
      importance: string;
      urgency: string;
    };
    relations: {
      subjects: string[];
      domains: string[];
      sdgs: string[];
      keywords: string[];
    };
  };

  // 2. 叙事结构
  structure: {
    framework: {
      type: string; // 时间线...
      perspective: string;
      rhythm: string;
      emotionCurve: string; // Image URL
      goal: string;
    };
    stages: { name: string; desc: string; duration: number }[];
    points: {
      turning: string[];
      climax: string;
      ending: string;
    };
    elements: {
      protagonist: string;
      conflict: string;
      suspense: string[];
      metaphor: string[];
      quotes: string[];
    };
    cognition: {
      start: string;
      goal: string;
      ladder: { level: number; cognition: string; activity: string }[];
      obstacles: string[];
      breakthroughs: string[];
    };
  };

  // 3. 展项配置与布局
  configuration: {
    exhibits: {
      suitableTypes: string[]; // UUIDs
      functionTable: { type: string; func: string }[];
      combinations: { name: string; exhibits: string[] }[];
      core: string[]; // UUIDs
      auxiliary: string[]; // UUIDs
    };
    layout: {
      space: string;
      area: number;
      type: string;
      flowChart: string; // Image URL
      zones: { name: string; func: string }[];
      focus: string[];
      transition: string;
      restPoints: { location: string; func: string }[];
    };
    examples: {
      visual: string[];
      mechanical: string[];
      data: string[];
      immersive: string[];
      interactive: string[];
      art: string[];
    };
  };

  // 4. 内容与信息
  content: {
    framework: {
      core: string[];
      data: { label: string; value: string }[];
      concepts: { name: string; desc: string }[];
      stories: { person: string; story: string }[];
      timeline: { time: string; event: string }[];
      geography: { region: string; feature: string }[];
    };
    levels: {
      l1: string[];
      l2: string[];
      l3: string[];
      l4: string[];
    };
    carriers: {
      boards: string;
      videos: { type: string; duration: number }[];
      interactive: { func: string; interface: string }[];
      objects: { name: string; type: string }[];
      visualization: { data: string; form: string }[];
    };
    tactics: {
      suspense: string[];
      contrast: string[];
      analogy: string[];
      plot: string;
      resonance: string[];
    };
  };

  // 5. 体验与互动
  experience: {
    goals: {
      cognitive: string;
      emotional: string;
      behavioral: string;
      social: string;
    };
    design: {
      senses: { sense: string; experience: string }[];
      rhythm: string;
      surprise: string[];
      memory: string[];
      photo: string[];
    };
    interaction: {
      observation: string[];
      operation: string[];
      inquiry: string[];
      creation: string[];
      share: string[];
    };
    participation: {
      individual: number; // Stars 1-5
      group: number;
      family: number;
      community: number;
      continuous: string;
    };
    emotion: {
      start: string;
      path: string;
      climax: string;
      end: string;
      memory: string;
    };
  };

  // 6. 评估与优化
  evaluation: {
    indicators: {
      understanding: number;
      satisfaction: number;
      duration: number;
      depth: string;
      behaviorChange: number;
      socialShare: number;
    };
    methods: {
      observation: string;
      interview: string;
      questionnaire: string;
      tracking: string[];
      focusGroup: string;
    };
    iteration: {
      versions: { version: string; change: string }[];
      success: string[];
      failure: string[];
      suggestions: string;
      todos: string[];
    };
    references: {
      similar: string[];
      global: { country: string; case: string }[];
      awards: { award: string; case: string }[];
      academic: { author: string; title: string; link: string }[];
    };
    status: {
      maturity: string;
      count: number;
      agencies: string[];
      date: string;
      report: string;
    };
  };
}
```

## 3. 核心流程
与科学原理库、学科对照库一致。

## 4. UI 设计
- **Form**: 6 个 Tabs (基础信息、叙事结构、展项配置、内容信息、体验互动、评估优化)。
- **Import**: 标准 JSON 模板。
