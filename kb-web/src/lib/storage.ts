import fs from 'fs/promises';
import path from 'path';

// 默认存储路径 (开发环境用 uploads，生产环境建议配置环境变量)
const STORAGE_ROOT = process.env.STORAGE_ROOT || path.join(process.cwd(), 'uploads');

export async function saveFile(file: File): Promise<{ path: string; size: number; mimeType: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 确保目录存在
  await fs.mkdir(STORAGE_ROOT, { recursive: true });
  
  // 生成唯一文件名 (这里简单用时间戳+原名，生产环境建议用 UUID)
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(STORAGE_ROOT, fileName);
  
  await fs.writeFile(filePath, buffer);
  
  return {
    path: filePath,
    size: buffer.length,
    mimeType: file.type
  };
}

export async function getFileStream(filePath: string) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return null;
    
    // 返回文件句柄和元数据
    const fileHandle = await fs.open(filePath, 'r');
    return {
        stream: fileHandle.createReadStream(),
        size: stat.size
    }
  } catch (error) {
    return null;
  }
}
