import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentPromoterOrg } from '@/lib/server/current-user';

const TicketTierSchema = z.object({
  name: z.string().trim().min(1).max(120),
  price: z.coerce.number().min(0),
  description: z.string().trim().max(240).optional().default(''),
});

const EventSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(180),
  startsAt: z.string().min(1),
  endsAt: z.string().optional().or(z.literal('')),
  venue: z.string().trim().min(2).max(180),
  city: z.string().trim().min(2).max(120),
  ticketingProvider: z.enum(['TIXR', 'MOSHTIX', 'HUMANITIX', 'MANUAL']),
  ticketingUrl: z.string().trim().url(),
  commissionPct: z.coerce.number().min(0).max(100),
  inventoryCap: z.coerce.number().int().min(0).optional().default(0),
  heroImageUrl: z.string().trim().url().optional().or(z.literal('')),
  description: z.string().trim().max(5000).optional().default(''),
  status: z.enum(['DRAFT', 'LIVE', 'PAUSED']).default('DRAFT'),
  ticketTiers: z.array(TicketTierSchema).min(1),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function buildUniqueSlug(baseTitle: string, excludeId?: string) {
  const base = slugify(baseTitle) || `event-${Date.now()}`;
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.event.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

export async function POST(req: Request) {
  const org = await getCurrentPromoterOrg();
  if (!org) {
    return NextResponse.json({ error: 'Promoter org not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid event payload.' }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await buildUniqueSlug(data.title, data.id);

  const saved = await prisma.$transaction(async (tx) => {
    const event = data.id
      ? await tx.event.update({
          where: { id: data.id },
          data: {
            title: data.title,
            slug,
            venue: data.venue,
            city: data.city,
            startsAt: new Date(data.startsAt),
            endsAt: data.endsAt ? new Date(data.endsAt) : null,
            status: data.status,
            ticketingProvider: data.ticketingProvider,
            ticketingUrl: data.ticketingUrl,
            defaultCommissionBps: Math.round(data.commissionPct * 100),
            capacity: data.inventoryCap,
            heroImageUrl: data.heroImageUrl || null,
            description: data.description || null,
          },
        })
      : await tx.event.create({
          data: {
            orgId: org.id,
            title: data.title,
            slug,
            venue: data.venue,
            city: data.city,
            startsAt: new Date(data.startsAt),
            endsAt: data.endsAt ? new Date(data.endsAt) : null,
            status: data.status,
            ticketingProvider: data.ticketingProvider,
            ticketingUrl: data.ticketingUrl,
            defaultCommissionBps: Math.round(data.commissionPct * 100),
            capacity: data.inventoryCap,
            heroImageUrl: data.heroImageUrl || null,
            description: data.description || null,
          },
        });

    await tx.ticketTier.deleteMany({ where: { eventId: event.id } });
    await tx.ticketTier.createMany({
      data: data.ticketTiers.map((tier, index) => ({
        eventId: event.id,
        name: tier.name,
        description: tier.description || null,
        priceCents: Math.round(tier.price * 100),
        sortOrder: index,
      })),
    });

    return event;
  });

  return NextResponse.json({ ok: true, eventId: saved.id, slug });
}
