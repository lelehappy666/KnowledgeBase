import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exhibit: string; file: string }> }
) {
  const { exhibit, file } = await params;
  
  // 解码 URL 编码的参数 (例如中文)
  const exhibitName = decodeURIComponent(exhibit);
  const fileName = decodeURIComponent(file);
  
  // 安全检查: 防止目录遍历
  if (exhibitName.includes('..') || fileName.includes('..')) {
      return new NextResponse('Invalid path', { status: 400 });
  }

  const DOC_ROOT = path.join(process.cwd(), 'Doc');
  const filePath = path.join(DOC_ROOT, exhibitName, fileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File Not Found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');
  const mimeType = mime.getType(filePath) || 'application/octet-stream';

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });
    
    // @ts-ignore: Next.js Stream Response type mismatch workaround
    return new NextResponse(fileStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': mimeType,
      },
    });
  } else {
    const fileStream = fs.createReadStream(filePath);
    // @ts-ignore
    return new NextResponse(fileStream, {
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': mimeType,
      },
    });
  }
}
