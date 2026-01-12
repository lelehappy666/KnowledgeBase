import { NextResponse } from 'next/server';
import { ManaParser } from '@/lib/parsers/mana';
import { BehanceParser } from '@/lib/parsers/behance';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, platform } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedData;

    switch (platform) {
      case 'MANA':
        const manaParser = new ManaParser();
        parsedData = await manaParser.parse(url);
        break;
      case 'BEHANCE':
        const behanceParser = new BehanceParser();
        parsedData = await behanceParser.parse(url);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 });
  }
}
