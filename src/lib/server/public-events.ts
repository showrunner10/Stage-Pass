import { events as mockEvents } from '@/data/mock';
import { prisma } from '@/lib/prisma';

export type PublicEventCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  city: string;
  venue: string;
  promoter: string;
  commission: number;
  commissionFixed: number;
  category: string;
  status: 'Draft' | 'Live' | 'Paused' | 'Ended';
  inventoryCap: number;
  soldCount: number;
  ticketTiers: { name: string; price: number; description: string }[];
};

function fmtDate(startsAt: Date, endsAt: Date | null) {
  const start = startsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (!endsAt) return `${start}, ${startsAt.getFullYear()}`;
  const end = endsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${start}-${end}, ${startsAt.getFullYear()}`;
}

function toStatus(status: 'DRAFT' | 'LIVE' | 'PAUSED' | 'ENDED'): PublicEventCard['status'] {
  if (status === 'DRAFT') return 'Draft';
  if (status === 'PAUSED') return 'Paused';
  if (status === 'ENDED') return 'Ended';
  return 'Live';
}

function inferCategory(slug: string, title: string) {
  const text = `${slug} ${title}`.toLowerCase();
  if (text.includes('fashion') || text.includes('runway')) return 'Fashion';
  if (text.includes('beauty') || text.includes('glow')) return 'Beauty Products';
  if (text.includes('clothing') || text.includes('stitch')) return 'Clothing';
  if (text.includes('wellness') || text.includes('yoga') || text.includes('retreat')) return 'Wellness';
  if (text.includes('conference') || text.includes('summit')) return 'Conference';
  if (text.includes('wine')) return 'Wine Event';
  if (text.includes('warehouse')) return 'Warehouse Party';
  return 'Festival';
}

export async function getPublicEvents(): Promise<PublicEventCard[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { status: 'LIVE' },
      orderBy: [{ startsAt: 'asc' }],
      include: {
        org: { select: { name: true } },
        ticketTiers: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return rows.map((row) => {
      const firstTier = row.ticketTiers[0];
      const firstTierPrice = firstTier ? firstTier.priceCents / 100 : 0;
      const commissionPct = row.defaultCommissionBps / 100;
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description ?? '',
        image: row.heroImageUrl ?? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
        date: fmtDate(row.startsAt, row.endsAt),
        location: row.venue,
        city: row.city,
        venue: row.venue,
        promoter: row.org.name,
        commission: commissionPct,
        commissionFixed: Math.round((firstTierPrice * commissionPct) / 100),
        category: inferCategory(row.slug, row.title),
        status: toStatus(row.status),
        inventoryCap: row.capacity ?? 0,
        soldCount: row.soldCount,
        ticketTiers: row.ticketTiers.map((t) => ({
          name: t.name,
          price: t.priceCents / 100,
          description: t.description ?? '',
        })),
      };
    });
  } catch {
    return mockEvents;
  }
}

export async function getPublicEventBySlug(slug: string): Promise<PublicEventCard | null> {
  try {
    const row = await prisma.event.findUnique({
      where: { slug },
      include: {
        org: { select: { name: true } },
        ticketTiers: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!row) return null;

    const firstTier = row.ticketTiers[0];
    const firstTierPrice = firstTier ? firstTier.priceCents / 100 : 0;
    const commissionPct = row.defaultCommissionBps / 100;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? '',
      image: row.heroImageUrl ?? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
      date: fmtDate(row.startsAt, row.endsAt),
      location: row.venue,
      city: row.city,
      venue: row.venue,
      promoter: row.org.name,
      commission: commissionPct,
      commissionFixed: Math.round((firstTierPrice * commissionPct) / 100),
      category: inferCategory(row.slug, row.title),
      status: toStatus(row.status),
      inventoryCap: row.capacity ?? 0,
      soldCount: row.soldCount,
      ticketTiers: row.ticketTiers.map((t) => ({
        name: t.name,
        price: t.priceCents / 100,
        description: t.description ?? '',
      })),
    };
  } catch {
    return mockEvents.find((e) => e.slug === slug) ?? null;
  }
}
