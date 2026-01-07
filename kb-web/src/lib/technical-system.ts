import fs from 'fs/promises';
import path from 'path';

const DOC_ROOT = path.join(process.cwd(), 'Doc');
const TECHNICAL_ROOT = path.join(DOC_ROOT, 'Technical_Engineering');
const FEASIBILITY_ROOT = path.join(TECHNICAL_ROOT, 'Technical_Feasibility');

async function ensureDir(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// --- Technical Feasibility ---

export interface TechnicalFeasibility {
  id: string;
  name: string;
  updatedAt: string;
  
  // 1. 基础信息
  basic: {
    id: string;
    category: string;
    description: string;
    keywords: string[];
    source: string;
  };

  // 2. 技术规格
  specs: {
    dimensions: string;
    weight: string;
    power: string;
    materials: string[];
    network: string;
    software: string;
  };

  // 3. 可行性评估
  analysis: {
    maturity: {
      trl: number;
      status: string;
      cases: number;
    };
    stability: {
      mtbf: string;
      durability: string;
      maintenanceCycle: string;
    };
    safety: {
      risks: string[];
      measures: string[];
      certifications: string[];
    };
    riskLevel: 'Low' | 'Medium' | 'High';
  };

  // 4. 实施要求
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
      difficulty: number;
      time: string;
    };
    skill: {
      development: string[];
      operation: string[];
    };
  };

  // 5. 成本估算
  cost: {
    development: number;
    hardware: number;
    software: number;
    deployment: number;
    maintenance: number;
    total: number;
  };

  // 6. 交互与体验 (技术视角)
  interaction: {
    input: string[];
    output: string[];
    latency: string;
    throughput: string;
  };
}

export async function getAllTechnicalFeasibilities(): Promise<TechnicalFeasibility[]> {
  await ensureDir(FEASIBILITY_ROOT);
  const files = await fs.readdir(FEASIBILITY_ROOT, { withFileTypes: true });
  const items: TechnicalFeasibility[] = [];

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const jsonPath = path.join(FEASIBILITY_ROOT, file.name);
      try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        const item = JSON.parse(data);
        if (!item.updatedAt) {
            const stat = await fs.stat(jsonPath);
            item.updatedAt = stat.mtime.toISOString();
        }
        items.push(item);
      } catch (e) {
        console.warn(`Failed to read technical feasibility data for ${file.name}`, e);
      }
    }
  }
  
  return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getTechnicalFeasibilityById(id: string): Promise<TechnicalFeasibility | null> {
  const items = await getAllTechnicalFeasibilities();
  return items.find(i => i.id === id) || null;
}

export async function saveTechnicalFeasibility(data: TechnicalFeasibility, oldName?: string) {
  await ensureDir(FEASIBILITY_ROOT);
  
  let fileName = data.name;
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  
  const filePath = path.join(FEASIBILITY_ROOT, `${fileName}.json`);

  if (oldName && oldName !== data.name) {
     let oldFileName = oldName.replace(/[/\\?%*:|"<>]/g, '-');
     const oldFilePath = path.join(FEASIBILITY_ROOT, `${oldFileName}.json`);
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

export async function deleteTechnicalFeasibility(id: string) {
    const item = await getTechnicalFeasibilityById(id);
    if (!item) return;

    let fileName = item.name.replace(/[/\\?%*:|"<>]/g, '-');
    const filePath = path.join(FEASIBILITY_ROOT, `${fileName}.json`);
    
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.error(`Failed to delete file ${filePath}`, e);
        throw e;
    }
}
