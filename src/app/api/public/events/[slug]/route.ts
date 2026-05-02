import { NextResponse } from 'next/server';
import { getPublicEventBySlug } from '@/lib/server/public-events';

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const event = await getPublicEventBySlug(slug);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load event' }, { status: 500 });
  }
}
