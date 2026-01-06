import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DOC_ROOT = path.join(process.cwd(), 'Doc');

// 确保 Doc 目录存在
async function ensureDocRoot() {
  try {
    await fs.access(DOC_ROOT);
  } catch {
    await fs.mkdir(DOC_ROOT, { recursive: true });
  }
}

export interface ExhibitData {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  metadata: any;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    path: string; // 相对路径, e.g., "cover.jpg"
    mimeType: string | null;
  }>;
  updatedAt: string;
}

export async function getAllExhibits(): Promise<ExhibitData[]> {
  await ensureDocRoot();
  const dirs = await fs.readdir(DOC_ROOT, { withFileTypes: true });
  const exhibits: ExhibitData[] = [];

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const jsonPath = path.join(DOC_ROOT, dir.name, 'data.json');
      try {
        const data = await fs.readFile(jsonPath, 'utf-8');
        const exhibit = JSON.parse(data);
        // 确保 updatedAt 存在
        if (!exhibit.updatedAt) {
            const stat = await fs.stat(jsonPath);
            exhibit.updatedAt = stat.mtime.toISOString();
        }
        exhibits.push(exhibit);
      } catch (e) {
        console.warn(`Failed to read exhibit data for ${dir.name}`, e);
      }
    }
  }
  
  // 按更新时间倒序
  return exhibits.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getExhibitById(id: string): Promise<ExhibitData | null> {
  const exhibits = await getAllExhibits();
  return exhibits.find(e => e.id === id) || null;
}

export async function saveExhibit(data: ExhibitData, oldTitle?: string) {
  await ensureDocRoot();
  
  // 如果标题改变了，可能需要重命名文件夹？
  // 简单起见，我们假设文件夹名称就是 title。如果 title 变了，我们需要移动文件夹。
  // 但这也意味着 url 可能会变。
  // 这里我们假设创建后文件夹名固定为 title，如果 title 修改，我们同步修改文件夹名。
  
  let dirName = data.title;
  // Sanitize dirName to be safe for file system
  dirName = dirName.replace(/[/\\?%*:|"<>]/g, '-');
  
  const dirPath = path.join(DOC_ROOT, dirName);

  if (oldTitle && oldTitle !== data.title) {
     let oldDirName = oldTitle.replace(/[/\\?%*:|"<>]/g, '-');
     const oldDirPath = path.join(DOC_ROOT, oldDirName);
     try {
         await fs.rename(oldDirPath, dirPath);
     } catch (e) {
         console.error(`Failed to rename directory from ${oldDirName} to ${dirName}`, e);
         // 如果重命名失败，可能目标已存在或者源不存在，尝试直接创建新目录
         await fs.mkdir(dirPath, { recursive: true });
     }
  } else {
      await fs.mkdir(dirPath, { recursive: true });
  }

  // 更新 data 中的 updatedAt
  data.updatedAt = new Date().toISOString();

  const jsonPath = path.join(dirPath, 'data.json');
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  return data;
}

export async function saveExhibitFile(exhibitTitle: string, file: File, newFileName?: string): Promise<string> {
    let dirName = exhibitTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const dirPath = path.join(DOC_ROOT, dirName);
    await fs.mkdir(dirPath, { recursive: true });

    const fileName = newFileName || file.name;
    const filePath = path.join(dirPath, fileName);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    return fileName; // 返回相对路径 (文件名)
}

// 从 uploads 复制文件到 Doc
export async function copyAssetToExhibit(exhibitTitle: string, sourcePath: string, fileName: string) {
    let dirName = exhibitTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const dirPath = path.join(DOC_ROOT, dirName);
    await fs.mkdir(dirPath, { recursive: true });

    const destPath = path.join(dirPath, fileName);
    
    // sourcePath 应该是绝对路径
    try {
        await fs.copyFile(sourcePath, destPath);
        return fileName;
    } catch (e) {
        console.error(`Failed to copy file from ${sourcePath} to ${destPath}`, e);
        throw e;
    }
}
