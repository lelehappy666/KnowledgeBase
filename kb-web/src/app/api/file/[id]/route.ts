import { NextRequest, NextResponse } from 'next/server';
import { getFileStream } from '@/lib/storage';
import db from '@/lib/db';
import fs from 'fs';

// 使用 Node.js Runtime 而不是 Edge，因为需要文件系统访问
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  
  const asset = await db.asset.findUnique({
    where: { id }
  });

  if (!asset) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileData = await getFileStream(asset.path);
  
  if (!fileData) {
    return new NextResponse('File Not Found on Disk', { status: 404 });
  }

  // 创建 ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      fileData.stream.on('data', (chunk) => controller.enqueue(chunk));
      fileData.stream.on('end', () => controller.close());
      fileData.stream.on('error', (err) => controller.error(err));
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': asset.mimeType || 'application/octet-stream',
      'Content-Length': fileData.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
