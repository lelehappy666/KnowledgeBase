import fs from 'fs/promises';
import path from 'path';

const DOC_ROOT = path.join(process.cwd(), 'Doc');
const CONTENT_ROOT = path.join(DOC_ROOT, 'Content_Knowledge');
const PRINCIPLES_ROOT = path.join(CONTENT_ROOT, 'Science_Principles');
const SUBJECT_MAPPING_ROOT = path.join(CONTENT_ROOT, 'Subject_Mapping');
const NARRATIVE_THEME_ROOT = path.join(CONTENT_ROOT, 'Narrative_Theme');

async function ensureDir(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// --- Science Principle ---

export interface SciencePrinciple {
  id: string;
  name: string;
  updatedAt: string;
  
  // 1. 基础信息
  basic: {
    aliases: string[];
    enName: string;
    icon?: string;
    abstract: string;
    history: string;
  };

  // 2. 分类体系
  classification: {
    category: string;
    subCategory: string;
    crossDiscipline: string[];
    knowledgeSystem: string;
    difficultyLevel: string;
  };

  // 3. 教育与课程
  education: {
    gradeLevel: string[];
    gradeSpecific: string[];
    curriculum: {
      standard: any[];
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
    suitableTypes: string[];
    existingCases: string[];
    creativeIdeas: any[];
    design: {
      visualStrategy: string;
      interactionPoints: string[];
      experiencePoints: string[];
      techPath: string[];
    };
    difficulty: {
      understanding: number;
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
      evaluationRubric: string;
    };
    resources: {
      ppt: string;
      guide: string;
      manual: string;
      video: string;
      materials: string;
      equipment: any[];
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
      effect: number;
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

export async function getAllSciencePrinciples(): Promise<SciencePrinciple[]> {
  await ensureDir(PRINCIPLES_ROOT);
  const files = await fs.readdir(PRINCIPLES_ROOT, { withFileTypes: true });
  const principles: SciencePrinciple[] = [];

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const jsonPath = path.join(PRINCIPLES_ROOT, file.name);
      try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        const principle = JSON.parse(data);
        if (!principle.updatedAt) {
            const stat = await fs.stat(jsonPath);
            principle.updatedAt = stat.mtime.toISOString();
        }
        principles.push(principle);
      } catch (e) {
        console.warn(`Failed to read science principle data for ${file.name}`, e);
      }
    }
  }
  
  return principles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getSciencePrincipleById(id: string): Promise<SciencePrinciple | null> {
  const principles = await getAllSciencePrinciples();
  return principles.find(p => p.id === id) || null;
}

export async function saveSciencePrinciple(data: SciencePrinciple, oldName?: string) {
  await ensureDir(PRINCIPLES_ROOT);
  
  let fileName = data.name;
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  
  const filePath = path.join(PRINCIPLES_ROOT, `${fileName}.json`);

  if (oldName && oldName !== data.name) {
     let oldFileName = oldName.replace(/[/\\?%*:|"<>]/g, '-');
     const oldFilePath = path.join(PRINCIPLES_ROOT, `${oldFileName}.json`);
     try {
         await fs.rename(oldFilePath, filePath);
     } catch (e) {
         console.error(`Failed to rename file from ${oldFileName} to ${fileName}`, e);
     }
  }

  data.updatedAt = new Date().toISOString();

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  
  return data;
}

export async function deleteSciencePrinciple(id: string) {
    const principle = await getSciencePrincipleById(id);
    if (!principle) return;

    let fileName = principle.name.replace(/[/\\?%*:|"<>]/g, '-');
    const filePath = path.join(PRINCIPLES_ROOT, `${fileName}.json`);
    
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.error(`Failed to delete file ${filePath}`, e);
        throw e;
    }
}

// --- Subject Mapping ---

export interface SubjectMapping {
  id: string;
  name: string;
  updatedAt: string;
  
  basic: {
    code: string;
    purpose: string;
  };

  dimensions: {
    exhibit: {
      typeId: string;
      subTypes: string[];
      interaction: string[];
      experience: string[];
    };
    subject: {
      category: string;
      branch: string;
      topic: string;
      standard: string;
    };
    grade: {
      level: string;
      specific: string[];
      ageRange: string;
      cognitiveLevel: string;
    };
  };

  knowledge: {
    principleId: string;
    name: string;
    code: string;
    depth: string;
    type: string;
    match: {
      score: number;
      reason: string;
      pros: string[];
      cons: string[];
      complementary: string[];
    };
  };

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
    standards: any[];
    performance: string;
  };
  outcome: {
    works: string[];
    example: string;
    display: string[];
  };

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
      extended: any[];
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

  validation: {
    cases: string[];
    schools: string[];
    dates: string[];
    report: string;
    feedback: {
      student: string;
      teacher: string;
      effect: any[];
      engagement: number;
      satisfaction: number;
    };
    improvement: {
      history: any[];
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

export async function getAllSubjectMappings(): Promise<SubjectMapping[]> {
  await ensureDir(SUBJECT_MAPPING_ROOT);
  const files = await fs.readdir(SUBJECT_MAPPING_ROOT, { withFileTypes: true });
  const mappings: SubjectMapping[] = [];

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const jsonPath = path.join(SUBJECT_MAPPING_ROOT, file.name);
      try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        const mapping = JSON.parse(data);
        if (!mapping.updatedAt) {
            const stat = await fs.stat(jsonPath);
            mapping.updatedAt = stat.mtime.toISOString();
        }
        mappings.push(mapping);
      } catch (e) {
        console.warn(`Failed to read subject mapping data for ${file.name}`, e);
      }
    }
  }
  
  return mappings.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getSubjectMappingById(id: string): Promise<SubjectMapping | null> {
  const mappings = await getAllSubjectMappings();
  return mappings.find(m => m.id === id) || null;
}

export async function saveSubjectMapping(data: SubjectMapping, oldName?: string) {
  await ensureDir(SUBJECT_MAPPING_ROOT);
  
  let fileName = data.name;
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  
  const filePath = path.join(SUBJECT_MAPPING_ROOT, `${fileName}.json`);

  if (oldName && oldName !== data.name) {
     let oldFileName = oldName.replace(/[/\\?%*:|"<>]/g, '-');
     const oldFilePath = path.join(SUBJECT_MAPPING_ROOT, `${oldFileName}.json`);
     try {
         await fs.rename(oldFilePath, filePath);
     } catch (e) {
         console.error(`Failed to rename file from ${oldFileName} to ${fileName}`, e);
     }
  }

  data.updatedAt = new Date().toISOString();

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  
  return data;
}

export async function deleteSubjectMapping(id: string) {
    const mapping = await getSubjectMappingById(id);
    if (!mapping) return;

    let fileName = mapping.name.replace(/[/\\?%*:|"<>]/g, '-');
    const filePath = path.join(SUBJECT_MAPPING_ROOT, `${fileName}.json`);
    
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.error(`Failed to delete file ${filePath}`, e);
        throw e;
    }
}

// --- Narrative Theme ---

export interface NarrativeTheme {
  id: string;
  name: string;
  updatedAt: string;
  
  basic: {
    id: string;
    aliases: string[];
    icon: string;
    color: string;
    slogan: string;
    abstract: string;
    attributes: {
      type: string;
      scale: string;
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

  structure: {
    framework: {
      type: string;
      perspective: string;
      rhythm: string;
      emotionCurve: string;
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

  configuration: {
    exhibits: {
      suitableTypes: string[];
      functionTable: { type: string; func: string }[];
      combinations: { name: string; exhibits: string[] }[];
      core: string[];
      auxiliary: string[];
    };
    layout: {
      space: string;
      area: number;
      type: string;
      flowChart: string;
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
      individual: number;
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

export async function getAllNarrativeThemes(): Promise<NarrativeTheme[]> {
  await ensureDir(NARRATIVE_THEME_ROOT);
  const files = await fs.readdir(NARRATIVE_THEME_ROOT, { withFileTypes: true });
  const themes: NarrativeTheme[] = [];

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const jsonPath = path.join(NARRATIVE_THEME_ROOT, file.name);
      try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        const theme = JSON.parse(data);
        if (!theme.updatedAt) {
            const stat = await fs.stat(jsonPath);
            theme.updatedAt = stat.mtime.toISOString();
        }
        themes.push(theme);
      } catch (e) {
        console.warn(`Failed to read narrative theme data for ${file.name}`, e);
      }
    }
  }
  
  return themes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getNarrativeThemeById(id: string): Promise<NarrativeTheme | null> {
  const themes = await getAllNarrativeThemes();
  return themes.find(t => t.id === id) || null;
}

export async function saveNarrativeTheme(data: NarrativeTheme, oldName?: string) {
  await ensureDir(NARRATIVE_THEME_ROOT);
  
  let fileName = data.name;
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  
  const filePath = path.join(NARRATIVE_THEME_ROOT, `${fileName}.json`);

  if (oldName && oldName !== data.name) {
     let oldFileName = oldName.replace(/[/\\?%*:|"<>]/g, '-');
     const oldFilePath = path.join(NARRATIVE_THEME_ROOT, `${oldFileName}.json`);
     try {
         await fs.rename(oldFilePath, filePath);
     } catch (e) {
         console.error(`Failed to rename file from ${oldFileName} to ${fileName}`, e);
     }
  }

  data.updatedAt = new Date().toISOString();

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  
  return data;
}

export async function deleteNarrativeTheme(id: string) {
    const theme = await getNarrativeThemeById(id);
    if (!theme) return;

    let fileName = theme.name.replace(/[/\\?%*:|"<>]/g, '-');
    const filePath = path.join(NARRATIVE_THEME_ROOT, `${fileName}.json`);
    
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.error(`Failed to delete file ${filePath}`, e);
        throw e;
    }
}
