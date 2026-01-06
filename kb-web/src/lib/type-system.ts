import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TYPES_ROOT = path.join(process.cwd(), 'Doc', 'Trends', 'Module2_Types');

// 确保目录存在
async function ensureTypesRoot() {
  try {
    await fs.access(TYPES_ROOT);
  } catch {
    await fs.mkdir(TYPES_ROOT, { recursive: true });
  }
}

export interface TypeData {
  id: string;
  definition: {
    name: string;
    code: string;
  };
  classification: {
    interactionMethod: string[]; // 多选
    contentType: string[]; // 多选
    experienceType: string[]; // 多选
  };
  technical: {
    complexity: 'Low' | 'Medium' | 'High' | 'Very High';
    difficulty: number; // 1-5
    developmentCycle: string;
    techRequirements: string[];
  };
  experience: {
    interactionDepth: string;
    participantCount: string;
    duration: string;
    learningCurve: string;
  };
  application: {
    spaceRequirements: string[];
    themes: string[]; // UUIDs
    scenarios: string[];
    audience: string[];
  };
  cost: {
    costRange: string;
    maintenanceCost: string;
    updateFrequency: string;
  };
  relations: {
    typicalCases: string[]; // UUIDs
    bestPractices: string[]; // UUIDs
    commonIssues: string[]; // UUIDs
    predecessors: string[]; // UUIDs
    similarTypes: string[]; // UUIDs
    complementaryTypes: string[]; // UUIDs
  };
  design: {
    designGuide: string; // Rich Text
    layoutSuggestions: string; // Rich Text
    safetySpecs: string[];
    accessibility: string; // Rich Text
  };
  evaluation: {
    experienceStandard: string;
    educationStandard: string;
    technicalStandard: string;
  };
  updatedAt: string;
}

export async function getAllTypes(): Promise<TypeData[]> {
  await ensureTypesRoot();
  const files = await fs.readdir(TYPES_ROOT);
  const types: TypeData[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(TYPES_ROOT, file);
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        const typeItem = JSON.parse(data);
        types.push(typeItem);
      } catch (e) {
        console.warn(`Failed to read type data for ${file}`, e);
      }
    }
  }
  
  return types.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getTypeById(id: string): Promise<TypeData | null> {
  const types = await getAllTypes();
  return types.find(t => t.id === id) || null;
}

export async function saveType(data: TypeData) {
  await ensureTypesRoot();
  
  const safeName = data.definition.name.replace(/[/\\?%*:|"<>]/g, '-');
  const fileName = `${safeName}.json`;
  const filePath = path.join(TYPES_ROOT, fileName);

  // Check for renaming
  const existingFiles = await fs.readdir(TYPES_ROOT);
  for (const file of existingFiles) {
      if (file.endsWith('.json')) {
          try {
              const content = JSON.parse(await fs.readFile(path.join(TYPES_ROOT, file), 'utf-8'));
              if (content.id === data.id && file !== fileName) {
                  await fs.unlink(path.join(TYPES_ROOT, file));
                  break;
              }
          } catch {}
      }
  }

  data.updatedAt = new Date().toISOString();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export async function createType(data: Omit<TypeData, 'id' | 'updatedAt'>) {
    const id = uuidv4();
    const newType: TypeData = {
        ...data,
        id,
        updatedAt: new Date().toISOString()
    };
    return await saveType(newType);
}

export async function deleteType(id: string) {
  await ensureTypesRoot();
  const files = await fs.readdir(TYPES_ROOT);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(TYPES_ROOT, file);
      try {
        const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (content.id === id) {
            await fs.unlink(filePath);
            return true;
        }
      } catch (e) {
        console.warn(`Failed to delete type data for ${file}`, e);
      }
    }
  }
  return false;
}
