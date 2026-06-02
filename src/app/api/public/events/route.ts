import { NextResponse } from 'next/server';
import { getPublicEvents } from '@/lib/server/public-events';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await getPublicEvents();
    let dbConnected = false;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    return NextResponse.json({
      items: events,
      dbConnected,
      source: dbConnected && events.length > 0 && !events[0]?.id?.match(/^\d+$/) ? 'database' : 'fallback-mock',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}
