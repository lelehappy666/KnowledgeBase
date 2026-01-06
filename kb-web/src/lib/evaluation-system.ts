import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const EVALUATION_ROOT = path.join(process.cwd(), 'Doc', 'Trends', 'Module3_Evaluation');

// 确保目录存在
async function ensureEvaluationRoot() {
  try {
    await fs.access(EVALUATION_ROOT);
  } catch {
    await fs.mkdir(EVALUATION_ROOT, { recursive: true });
  }
}

export interface EvaluationData {
  id: string;
  target: {
    type: 'Exhibit' | 'Type' | 'Trend' | 'Other';
    name: string; // 评价对象的名称，例如 "Hololens 2" 或 "体感互动"
    refId?: string; // 可选关联ID
  };
  scores: {
    experience: number; // 体验性 1-5
    understanding: number; // 易理解性 1-5
    scientific: number; // 科学性 1-5
    maintainability: number; // 可维护性 1-5
    innovation: number; // 创新度 1-5
    replicability: number; // 可复制性 1-5
  };
  cost: {
    range: string; // 0-1万, 1-5万, ...
    currency: string;
    details?: string;
  };
  analysis: {
    pros: string[];
    cons: string[];
    summary: string;
  };
  tags: string[];
  updatedAt: string;
}

export async function getAllEvaluations(): Promise<EvaluationData[]> {
  await ensureEvaluationRoot();
  const files = await fs.readdir(EVALUATION_ROOT);
  const evaluations: EvaluationData[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(EVALUATION_ROOT, file);
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        const evaluation = JSON.parse(data);
        evaluations.push(evaluation);
      } catch (e) {
        console.warn(`Failed to read evaluation data for ${file}`, e);
      }
    }
  }
  
  return evaluations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getEvaluationById(id: string): Promise<EvaluationData | null> {
  const evaluations = await getAllEvaluations();
  return evaluations.find(e => e.id === id) || null;
}

export async function saveEvaluation(data: EvaluationData) {
  await ensureEvaluationRoot();
  
  // Use Target Name + ID snippet as filename to ensure uniqueness and readability
  const safeName = data.target.name.replace(/[/\\?%*:|"<>]/g, '-');
  const fileName = `${safeName}_${data.id.substring(0, 8)}.json`;
  const filePath = path.join(EVALUATION_ROOT, fileName);

  // Check for existing file with same ID to handle updates (and potential renames)
  const existingFiles = await fs.readdir(EVALUATION_ROOT);
  for (const file of existingFiles) {
      if (file.endsWith('.json')) {
          try {
              const content = JSON.parse(await fs.readFile(path.join(EVALUATION_ROOT, file), 'utf-8'));
              if (content.id === data.id && file !== fileName) {
                  await fs.unlink(path.join(EVALUATION_ROOT, file));
                  break;
              }
          } catch {}
      }
  }

  data.updatedAt = new Date().toISOString();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export async function createEvaluation(data: Omit<EvaluationData, 'id' | 'updatedAt'>) {
    const id = uuidv4();
    const newEvaluation: EvaluationData = {
        ...data,
        id,
        updatedAt: new Date().toISOString()
    };
    return await saveEvaluation(newEvaluation);
}

export async function deleteEvaluation(id: string) {
  await ensureEvaluationRoot();
  const files = await fs.readdir(EVALUATION_ROOT);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(EVALUATION_ROOT, file);
      try {
        const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (content.id === id) {
            await fs.unlink(filePath);
            return true;
        }
      } catch (e) {
        console.warn(`Failed to delete evaluation data for ${file}`, e);
      }
    }
  }
  return false;
}
