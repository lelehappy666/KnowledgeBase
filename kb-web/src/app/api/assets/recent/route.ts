import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assets = await db.asset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error("Failed to fetch recent assets:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
