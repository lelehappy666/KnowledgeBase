import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cases = await db.onlineCase.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Failed to fetch online cases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, sourceUrl, platform, coverImage, content } = body;

    const newCase = await db.onlineCase.create({
      data: {
        title,
        description,
        sourceUrl,
        platform,
        coverImage,
        content,
      },
    });

    return NextResponse.json(newCase);
  } catch (error) {
    console.error('Failed to create online case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
