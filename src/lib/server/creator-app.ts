import { CampaignFormat, CampaignStatus, LedgerStatus, PayoutStatus } from '@prisma/client';
import { campaigns as mockCampaigns, creators as mockCreators, events as mockEvents, ledgerEntries as mockLedgerEntries } from '@/data/mock';
import { prisma } from '@/lib/prisma';
import { getCurrentCreatorProfile } from '@/lib/server/current-user';

type CreatorCampaignRow = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  creatorHandle: string;
  name: string;
  status: 'Draft' | 'Live' | 'Paused' | 'Archived';
  format: 'Tracked Link' | 'Landing Page';
  slug: string;
  headline: string;
  note: string;
  clicks: number;
  ticketsSold: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  createdAt: string;
  channelBreakdown: { channel: string; clicks: number; tickets: number }[];
};

type CreatorLedgerRow = {
  id: string;
  date: string;
  description: string;
  status: string;
  amount: number;
};

type CreatorPayoutRow = {
  id: string;
  createdAt: string;
  amount: number;
  status: string;
  transferId: string | null;
};

function mapCampaignStatus(status: CampaignStatus): CreatorCampaignRow['status'] {
  if (status === 'LIVE') return 'Live';
  if (status === 'PAUSED') return 'Paused';
  if (status === 'ARCHIVED') return 'Archived';
  return 'Draft';
}

function mapCampaignFormat(format: CampaignFormat): CreatorCampaignRow['format'] {
  return format === 'LANDING_PAGE' ? 'Landing Page' : 'Tracked Link';
}

function mapLedgerStatus(status: LedgerStatus) {
  if (status === 'CLEARED') return 'Cleared';
  if (status === 'PAID') return 'Paid';
  if (status === 'REVERSED') return 'Reversed';
  return 'Pending';
}

function mapPayoutStatus(status: PayoutStatus) {
  if (status === 'PAID') return 'Paid';
  if (status === 'PROCESSING') return 'Processing';
  if (status === 'FAILED') return 'Failed';
  if (status === 'SCHEDULED') return 'Scheduled';
  return 'Draft';
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fallbackCampaignRows() {
  return mockCampaigns
    .filter((campaign) => campaign.creatorId === mockCreators[0]?.id)
    .map((campaign) => {
      const event = mockEvents.find((row) => row.id === campaign.eventId);
      return {
        id: campaign.id,
        eventId: campaign.eventId,
        eventTitle: event?.title ?? 'Event',
        eventSlug: event?.slug ?? '',
        creatorHandle: mockCreators[0]?.handle ?? 'creator',
        name: campaign.name,
        status: campaign.status,
        format: campaign.format,
        slug: campaign.slug,
        headline: campaign.headline,
        note: campaign.note,
        clicks: campaign.clicks,
        ticketsSold: campaign.ticketsSold,
        revenue: campaign.revenue,
        commission: campaign.commission,
        conversionRate: campaign.conversionRate,
        createdAt: campaign.createdAt,
        channelBreakdown: [
          { channel: 'Instagram', clicks: Math.round(campaign.clicks * 0.46), tickets: Math.round(campaign.ticketsSold * 0.52) },
          { channel: 'TikTok', clicks: Math.round(campaign.clicks * 0.34), tickets: Math.round(campaign.ticketsSold * 0.28) },
          { channel: 'Newsletter', clicks: Math.round(campaign.clicks * 0.2), tickets: Math.round(campaign.ticketsSold * 0.2) },
        ],
      } satisfies CreatorCampaignRow;
    });
}

function fallbackLedgerRows(): CreatorLedgerRow[] {
  return mockLedgerEntries.map((entry) => ({
    id: entry.id,
    date: entry.date,
    description: entry.description,
    status: entry.status,
    amount: entry.amount,
  }));
}

export async function getCreatorAppSnapshot() {
  const fallbackCreator = mockCreators[0] ?? {
    id: 'fallback-creator',
    name: 'Hypelist Creator',
    handle: 'hypelist.creator',
    avatar: 'https://i.pravatar.cc/150?u=hypelist-creator',
    niche: 'Live events',
    audienceSize: 'Unverified',
    socialLinks: [],
    fitScore: 90,
    tier: 'Default' as const,
  };
  const fallbackCampaigns = fallbackCampaignRows();

  try {
    const creator = await getCurrentCreatorProfile();
    if (!creator) {
      return {
        creator: fallbackCreator,
        campaigns: fallbackCampaigns,
        ledger: fallbackLedgerRows(),
        payouts: [] as CreatorPayoutRow[],
        availableBalance: 4250,
        pendingBalance: 820,
        clearedBalance: 8900,
        paidLifetime: 12500,
      };
    }

    const [campaigns, ledger, payouts] = await Promise.all([
      prisma.campaign.findMany({
        where: { creatorId: creator.id },
        orderBy: [{ createdAt: 'desc' }],
        include: {
          event: true,
          channelLinks: {
            include: {
              _count: { select: { clicks: true } },
            },
          },
          orders: {
            select: { grossAmountCents: true },
          },
          ledger: {
            select: { commissionAmountCents: true },
          },
        },
      }),
      prisma.commissionLedger.findMany({
        where: { creatorId: creator.id },
        orderBy: [{ createdAt: 'desc' }],
        include: {
          order: {
            include: { event: { select: { title: true } } },
          },
        },
      }),
      prisma.payout.findMany({
        where: { creatorId: creator.id },
        orderBy: [{ createdAt: 'desc' }],
      }),
    ]);

    const campaignRows: CreatorCampaignRow[] = campaigns.map((campaign) => {
      const clicks = campaign.channelLinks.reduce((sum, link) => sum + link._count.clicks, 0);
      const ticketsSold = campaign.orders.length;
      const revenue = campaign.orders.reduce((sum, order) => sum + order.grossAmountCents, 0) / 100;
      const commission = campaign.ledger.reduce((sum, entry) => sum + entry.commissionAmountCents, 0) / 100;
      const channelBreakdown = campaign.channelLinks.map((link) => ({
        channel: link.channel
          .toLowerCase()
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        clicks: link._count.clicks,
        tickets: clicks === 0 ? 0 : Math.round((link._count.clicks / clicks) * ticketsSold),
      }));

      return {
        id: campaign.id,
        eventId: campaign.eventId,
        eventTitle: campaign.event.title,
        eventSlug: campaign.event.slug,
        creatorHandle: creator.handle,
        name: campaign.headline || `${campaign.event.title} campaign`,
        status: mapCampaignStatus(campaign.status),
        format: mapCampaignFormat(campaign.format),
        slug: campaign.slug,
        headline: campaign.headline ?? 'Campaign draft',
        note: campaign.description ?? '',
        clicks,
        ticketsSold,
        revenue,
        commission,
        conversionRate: clicks === 0 ? 0 : (ticketsSold / clicks) * 100,
        createdAt: campaign.createdAt.toISOString(),
        channelBreakdown:
          channelBreakdown.length > 0 ? channelBreakdown : [{ channel: 'Direct', clicks, tickets: ticketsSold }],
      };
    });

    const ledgerRows: CreatorLedgerRow[] = ledger.map((entry) => ({
      id: entry.id,
      date: formatDate(entry.createdAt),
      description: `Commission - ${entry.order.event.title}`,
      status: mapLedgerStatus(entry.status),
      amount: entry.commissionAmountCents / 100,
    }));

    const payoutRows: CreatorPayoutRow[] = payouts.map((payout) => ({
      id: payout.id,
      createdAt: formatDate(payout.createdAt),
      amount: payout.amountCents / 100,
      status: mapPayoutStatus(payout.status),
      transferId: payout.stripeTransferId ?? payout.stripePayoutId ?? null,
    }));

    const availableBalance = ledger
      .filter((entry) => entry.status === 'CLEARED')
      .reduce((sum, entry) => sum + entry.commissionAmountCents, 0) / 100;
    const pendingBalance = ledger
      .filter((entry) => entry.status === 'PENDING')
      .reduce((sum, entry) => sum + entry.commissionAmountCents, 0) / 100;
    const paidLifetime = payouts.reduce((sum, payout) => sum + payout.amountCents, 0) / 100;

    return {
      creator: {
        id: creator.id,
        name: creator.displayName,
        handle: creator.handle,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(creator.handle)}`,
        niche: creator.niche ?? 'Live events',
        audienceSize: creator.audienceSize ? `${creator.audienceSize.toLocaleString()}` : 'Unverified',
        socialLinks: [] as { platform: string; url: string }[],
        fitScore: 90,
        tier:
          creator.tier === 'HEADLINE' ? 'Headline' : creator.tier === 'ESTABLISHED' ? 'Established' : 'Default',
      },
      campaigns: campaignRows.length > 0 ? campaignRows : fallbackCampaigns,
      ledger: ledgerRows.length > 0 ? ledgerRows : fallbackLedgerRows(),
      payouts: payoutRows,
      availableBalance,
      pendingBalance,
      clearedBalance: availableBalance,
      paidLifetime,
    };
  } catch {
    return {
      creator: fallbackCreator,
      campaigns: fallbackCampaigns,
      ledger: fallbackLedgerRows(),
      payouts: [] as CreatorPayoutRow[],
      availableBalance: 4250,
      pendingBalance: 820,
      clearedBalance: 8900,
      paidLifetime: 12500,
    };
  }
}
