import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTiers: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        id: event.id,
        title: event.title,
        startsAt: event.startsAt.toISOString().slice(0, 16),
        endsAt: event.endsAt ? event.endsAt.toISOString().slice(0, 16) : '',
        venue: event.venue,
        city: event.city,
        ticketingProvider: event.ticketingProvider,
        ticketingUrl: event.ticketingUrl,
        commissionPct: event.defaultCommissionBps / 100,
        inventoryCap: event.capacity ?? 0,
        heroImageUrl: event.heroImageUrl ?? '',
        description: event.description ?? '',
        status: event.status,
        ticketTiers: event.ticketTiers.map((tier) => ({
          name: tier.name,
          price: tier.priceCents / 100,
          description: tier.description ?? '',
        })),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Could not load event.' }, { status: 500 });
  }
}
