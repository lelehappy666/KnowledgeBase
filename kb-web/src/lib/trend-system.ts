import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TRENDS_ROOT = path.join(process.cwd(), 'Doc', 'Trends');

// 确保 Trends 目录存在
async function ensureTrendsRoot() {
  try {
    await fs.access(TRENDS_ROOT);
  } catch {
    await fs.mkdir(TRENDS_ROOT, { recursive: true });
  }
}

// 确保模块子目录存在
async function ensureModuleDir(moduleName: string) {
    const modulePath = path.join(TRENDS_ROOT, moduleName);
    try {
        await fs.access(modulePath);
    } catch {
        await fs.mkdir(modulePath, { recursive: true });
    }
    return modulePath;
}

export interface TrendData {
  id: string;
  basic: {
    name: string;
    aliases: string[];
    discoveryDate: string; // Date string
    maturityPeriod: { start: string; end: string };
    declineDate: string; // Date string
  };
  attributes: {
    type: 'Technical' | 'Content' | 'Experience' | 'Other'; 
    intensity: 'Emerging' | 'Growing' | 'Mature' | 'Declining'; 
    scope: string[]; // e.g. ["国内", "行业"]
    credibility: 'Low' | 'Medium' | 'High' | 'Verified';
  };
  content: {
    description: string; 
    features: string[]; 
    drivers: string[]; 
    constraints: string[]; 
  };
  impact: {
    design: string;
    technology: string;
    cost: string;
    user: string;
  };
  cases: {
    typical: string[]; // UUIDs or Names
    failures: string[]; 
    competitors: string[]; 
  };
  data: {
    marketShare: number; 
    growthRate: number; 
    patents: number;
    papers: number;
    mediaReports: number;
  };
  application: {
    scenarios: string[]; 
    exhibitTypes: string[]; 
    suggestions: string; 
    risks: string; 
  };
  update: {
    frequency: 'Monthly' | 'Quarterly' | 'Semiannual' | 'Annual';
    lastUpdate: string;
    nextUpdate: string;
    history: any[];
  };
  sources: Array<{ type: string; name: string; credibility: string }>;
  updatedAt: string;
}

// 定义模块常量
const MODULES = {
    TRENDS: 'Module1_Trends',
    TYPES: 'Module2_Types',
    EVALUATION: 'Module3_Evaluation'
};

export async function getAllTrends(): Promise<TrendData[]> {
  const modulePath = await ensureModuleDir(MODULES.TRENDS);
  const files = await fs.readdir(modulePath);
  const trends: TrendData[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(modulePath, file);
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        const trend = JSON.parse(data);
        trends.push(trend);
      } catch (e) {
        console.warn(`Failed to read trend data for ${file}`, e);
      }
    }
  }
  
  return trends.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getTrendById(id: string): Promise<TrendData | null> {
  const trends = await getAllTrends();
  return trends.find(t => t.id === id) || null;
}

export async function saveTrend(data: TrendData) {
  const modulePath = await ensureModuleDir(MODULES.TRENDS);
  
  // Use Name as filename, fallback to ID if name is missing (though name is required)
  // Sanitize name for file system
  const safeName = data.basic.name.replace(/[/\\?%*:|"<>]/g, '-');
  const fileName = `${safeName}.json`;
  const filePath = path.join(modulePath, fileName);

  // Check if renaming is needed (if ID exists but filename changed)
  // This is tricky without tracking old name. 
  // Strategy: We search for file with this ID first.
  const existingFiles = await fs.readdir(modulePath);
  for (const file of existingFiles) {
      if (file.endsWith('.json')) {
          try {
              const content = JSON.parse(await fs.readFile(path.join(modulePath, file), 'utf-8'));
              if (content.id === data.id && file !== fileName) {
                  // Rename old file
                  await fs.unlink(path.join(modulePath, file));
                  break;
              }
          } catch {}
      }
  }

  data.updatedAt = new Date().toISOString();

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export async function createTrend(data: Omit<TrendData, 'id' | 'updatedAt'>) {
    const id = uuidv4();
    const newTrend: TrendData = {
        ...data,
        id,
        updatedAt: new Date().toISOString()
    };
    return await saveTrend(newTrend);
}

export async function deleteTrend(id: string) {
  const modulePath = await ensureModuleDir(MODULES.TRENDS);
  const files = await fs.readdir(modulePath);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(modulePath, file);
      try {
        const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (content.id === id) {
            await fs.unlink(filePath);
            return true;
        }
      } catch (e) {
        console.warn(`Failed to read/delete trend data for ${file}`, e);
      }
    }
  }
  return false;
}
