import { prisma } from '@/lib/prisma';
import { events as mockEvents } from '@/data/mock';
import { getCurrentPromoterOrg } from '@/lib/server/current-user';

export async function getAdminEvents() {
  try {
    const org = await getCurrentPromoterOrg();
    if (!org) return mockEvents;

    const rows = await prisma.event.findMany({
      where: { orgId: org.id },
      orderBy: [{ startsAt: 'desc' }],
      include: {
        ticketTiers: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? '',
      image: row.heroImageUrl ?? '',
      date: row.startsAt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: row.venue,
      city: row.city,
      venue: row.venue,
      promoter: org.name,
      commission: row.defaultCommissionBps / 100,
      commissionFixed: row.ticketTiers[0] ? Math.round((row.ticketTiers[0].priceCents / 100) * (row.defaultCommissionBps / 10000)) : 0,
      category: 'Live Event',
      status: row.status === 'LIVE' ? 'Live' : row.status === 'PAUSED' ? 'Paused' : row.status === 'ENDED' ? 'Ended' : 'Draft',
      inventoryCap: row.capacity ?? 0,
      soldCount: row.soldCount,
      ticketTiers: row.ticketTiers.map((tier) => ({
        name: tier.name,
        price: tier.priceCents / 100,
        description: tier.description ?? '',
      })),
    }));
  } catch {
    return mockEvents;
  }
}

export async function getAdminEventDetail(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTiers: { orderBy: { sortOrder: 'asc' } },
        campaigns: {
          include: {
            creator: true,
            orders: { select: { grossAmountCents: true } },
            ledger: { select: { commissionAmountCents: true } },
            channelLinks: {
              include: { _count: { select: { clicks: true } } },
            },
          },
        },
      },
    });

    if (!event) return null;

    const creatorRows = event.campaigns.map((campaign) => {
      const clicks = campaign.channelLinks.reduce((sum, link) => sum + link._count.clicks, 0);
      const sales = campaign.orders.length;
      const commission = campaign.ledger.reduce((sum, entry) => sum + entry.commissionAmountCents, 0) / 100;

      return {
        name: campaign.creator.displayName,
        followers: campaign.creator.audienceSize ? `${campaign.creator.audienceSize.toLocaleString()}` : 'Unknown',
        status: campaign.status === 'LIVE' ? 'Approved' : campaign.status === 'PAUSED' ? 'Paused' : 'Draft',
        sales,
        clicks,
        commission,
      };
    });

    return {
      id: event.id,
      title: event.title,
      description: event.description ?? '',
      venue: event.venue,
      city: event.city,
      date: event.startsAt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
      commission: event.defaultCommissionBps / 100,
      soldCount: event.soldCount,
      capacity: event.capacity ?? 0,
      tiers: event.ticketTiers.map((tier) => ({
        tier: tier.name,
        total: event.capacity ?? 0,
        sold: event.soldCount,
        reserved: 0,
        price: tier.priceCents / 100,
      })),
      creators: creatorRows,
    };
  } catch {
    return null;
  }
}
