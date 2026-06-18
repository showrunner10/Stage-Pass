const { PrismaClient, CampaignFormat, CampaignStatus, Channel, LandingType, CreatorTier, EventStatus, OrgMemberRole, TicketingProvider, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

function asDate(iso) {
  return new Date(iso);
}

async function main() {
  const promoterUser = await prisma.user.upsert({
    where: { email: 'admin@secretsounds.com' },
    update: {},
    create: {
      clerkId: 'seed_promoter_admin',
      email: 'admin@secretsounds.com',
      role: UserRole.PROMOTER,
    },
  });

  const org = await prisma.promoterOrg.upsert({
    where: { slug: 'secret-sounds' },
    update: { name: 'Secret Sounds' },
    create: {
      name: 'Secret Sounds',
      slug: 'secret-sounds',
      createdById: promoterUser.id,
    },
  });

  await prisma.promoterOrgMember.upsert({
    where: { orgId_userId: { orgId: org.id, userId: promoterUser.id } },
    update: { role: OrgMemberRole.OWNER },
    create: {
      orgId: org.id,
      userId: promoterUser.id,
      role: OrgMemberRole.OWNER,
    },
  });

  const creatorSeeds = [
    { email: 'maya@hypelist.app', clerkId: 'seed_creator_maya', handle: 'maya.rodriguez', displayName: 'Maya Rodriguez', niche: 'Music & Lifestyle', audienceSize: 125000, tier: CreatorTier.HEADLINE },
    { email: 'alex@hypelist.app', clerkId: 'seed_creator_alex', handle: 'alextalksevents', displayName: 'Alex Chen', niche: 'Nightlife & Culture', audienceSize: 45000, tier: CreatorTier.ESTABLISHED },
    { email: 'sarah@hypelist.app', clerkId: 'seed_creator_sarah', handle: 'sarah.j', displayName: 'Sarah Jenkins', niche: 'Food & Wine', audienceSize: 82000, tier: CreatorTier.ESTABLISHED },
  ];

  const creators = [];
  for (const c of creatorSeeds) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { role: UserRole.CREATOR },
      create: { clerkId: c.clerkId, email: c.email, role: UserRole.CREATOR },
    });

    const profile = await prisma.creatorProfile.upsert({
      where: { handle: c.handle },
      update: {
        displayName: c.displayName,
        niche: c.niche,
        audienceSize: c.audienceSize,
        tier: c.tier,
      },
      create: {
        userId: user.id,
        handle: c.handle,
        displayName: c.displayName,
        niche: c.niche,
        audienceSize: c.audienceSize,
        tier: c.tier,
      },
    });

    creators.push(profile);
  }

  const eventSeeds = [
    {
      slug: 'neon-tide-festival-2026',
      title: 'Neon Tide Festival 2026',
      description: 'A brand-new two-day coastal music festival on the Gold Coast. Sunset sets, beachfront stages, and headline acts across electronic, indie, and live performance.',
      image: '/images/neon-tide-festival.png',
      city: 'Gold Coast',
      venue: 'Coolangatta Beachfront',
      startsAt: '2026-03-14T07:00:00.000Z',
      endsAt: '2026-03-15T13:00:00.000Z',
      commissionBps: 1200,
      tiers: [
        { name: 'GA 2-Day Pass', priceCents: 19900, sortOrder: 0, description: 'Full weekend access to all beachfront stages' },
        { name: 'VIP Sunset Deck', priceCents: 37900, sortOrder: 1, description: 'Elevated ocean-view deck, premium bars & fast-track entry' },
      ],
    },
    {
      slug: 'solstice-festival-2026',
      title: 'Solstice Festival 2026',
      description: 'The ultimate summer celebration in Byron Bay. Three days of music, art, and connection.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2070&q=80',
      city: 'Byron Bay',
      venue: 'North Byron Parklands',
      startsAt: '2026-12-20T10:00:00.000Z',
      endsAt: '2026-12-22T23:00:00.000Z',
      commissionBps: 1200,
      tiers: [
        { name: 'GA Weekend', priceCents: 34900, sortOrder: 0, description: '3-day access to all stages' },
        { name: 'VIP Garden', priceCents: 59900, sortOrder: 1, description: 'Premium viewing and private bars' },
      ],
    },
    {
      slug: 'runway-nocturne-fashion-weekender',
      title: 'Runway Nocturne: Fashion Weekender',
      description: 'A two-night fashion showcase with emerging designers, live styling sets, and premium streetwear drops.',
      image: 'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=2070&q=80',
      city: 'Sydney',
      venue: 'Carriageworks',
      startsAt: '2026-11-14T09:00:00.000Z',
      endsAt: '2026-11-15T23:00:00.000Z',
      commissionBps: 1400,
      tiers: [
        { name: 'General Runway Pass', priceCents: 19000, sortOrder: 0, description: 'Evening runway + designer pop-ups' },
        { name: 'Backstage Preview', priceCents: 34000, sortOrder: 1, description: 'Early access + backstage walkthrough' },
      ],
    },
    {
      slug: 'glow-house-beauty-lab',
      title: 'Glow House Beauty Lab',
      description: 'A beauty-first creator event with product sampling, shade matching bars, and live tutorials.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2070&q=80',
      city: 'Sydney',
      venue: 'White Bay Studio',
      startsAt: '2026-09-27T12:00:00.000Z',
      endsAt: null,
      commissionBps: 1600,
      tiers: [
        { name: 'Beauty Lab Pass', priceCents: 9500, sortOrder: 0, description: 'Full access + product tote' },
      ],
    },
    {
      slug: 'stitch-social-clothing-market',
      title: 'Stitch Social Clothing Market',
      description: 'A curated clothing market with independent labels, resale drops, and live customization booths.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2070&q=80',
      city: 'Melbourne',
      venue: 'The Timber Yard',
      startsAt: '2026-10-18T10:00:00.000Z',
      endsAt: null,
      commissionBps: 1300,
      tiers: [
        { name: 'General Entry', priceCents: 6000, sortOrder: 0, description: 'Market floor + talks' },
      ],
    },
    {
      slug: 'aurora-wellness-weekend',
      title: 'Aurora Wellness Weekend',
      description: 'A premium wellness escape with breathwork, movement classes, and recovery sessions.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2070&q=80',
      city: 'Melbourne',
      venue: 'Mornington Peninsula Retreat Grounds',
      startsAt: '2026-11-07T08:00:00.000Z',
      endsAt: '2026-11-08T20:00:00.000Z',
      commissionBps: 1500,
      tiers: [
        { name: 'Weekend Pass', priceCents: 64000, sortOrder: 0, description: 'All sessions + recovery circuit' },
      ],
    },
  ];

  const createdEvents = [];
  for (const e of eventSeeds) {
    const event = await prisma.event.upsert({
      where: { slug: e.slug },
      update: {
        orgId: org.id,
        title: e.title,
        description: e.description,
        heroImageUrl: e.image,
        city: e.city,
        venue: e.venue,
        startsAt: asDate(e.startsAt),
        endsAt: e.endsAt ? asDate(e.endsAt) : null,
        status: EventStatus.LIVE,
        ticketingProvider: TicketingProvider.TIXR,
        ticketingUrl: `https://tickets.example.com/${e.slug}`,
        defaultCommissionBps: e.commissionBps,
      },
      create: {
        orgId: org.id,
        slug: e.slug,
        title: e.title,
        description: e.description,
        heroImageUrl: e.image,
        city: e.city,
        venue: e.venue,
        startsAt: asDate(e.startsAt),
        endsAt: e.endsAt ? asDate(e.endsAt) : null,
        status: EventStatus.LIVE,
        ticketingProvider: TicketingProvider.TIXR,
        ticketingUrl: `https://tickets.example.com/${e.slug}`,
        defaultCommissionBps: e.commissionBps,
      },
    });

    for (const tier of e.tiers) {
      await prisma.ticketTier.upsert({
        where: { eventId_name: { eventId: event.id, name: tier.name } },
        update: {
          description: tier.description,
          priceCents: tier.priceCents,
          sortOrder: tier.sortOrder,
        },
        create: {
          eventId: event.id,
          name: tier.name,
          description: tier.description,
          priceCents: tier.priceCents,
          sortOrder: tier.sortOrder,
        },
      });
    }

    createdEvents.push(event);
  }

  const eventsBySlug = Object.fromEntries(createdEvents.map((e) => [e.slug, e]));
  const neonTide = eventsBySlug['neon-tide-festival-2026'];
  const solstice = eventsBySlug['solstice-festival-2026'];

  const campaign = await prisma.campaign.upsert({
    where: { creatorId_slug: { creatorId: creators[0].id, slug: 'maya-solstice' } },
    update: {
      eventId: solstice.id,
      status: CampaignStatus.LIVE,
      format: CampaignFormat.LANDING_PAGE,
      headline: 'Join me at this one.',
      description: 'A campaign-ready launch page for Solstice.',
      accentColor: '#1969FF',
    },
    create: {
      creatorId: creators[0].id,
      eventId: solstice.id,
      slug: 'maya-solstice',
      status: CampaignStatus.LIVE,
      format: CampaignFormat.LANDING_PAGE,
      headline: 'Join me at this one.',
      description: 'A campaign-ready launch page for Solstice.',
      accentColor: '#1969FF',
    },
  });

  await prisma.channelLink.upsert({
    where: { campaignId_channel_landingType: { campaignId: campaign.id, channel: Channel.INSTAGRAM, landingType: LandingType.LANDING } },
    update: { code: 'maya-solstice-ig' },
    create: {
      campaignId: campaign.id,
      channel: Channel.INSTAGRAM,
      landingType: LandingType.LANDING,
      code: 'maya-solstice-ig',
      utmSource: 'instagram',
      utmMedium: 'creator',
      utmCampaign: 'maya-solstice',
    },
  });

  // Dummy LIVE festival: full campaign with tracked links + simulated clicks and orders.
  const neonCampaign = await prisma.campaign.upsert({
    where: { creatorId_slug: { creatorId: creators[0].id, slug: 'maya-neon-tide' } },
    update: {
      eventId: neonTide.id,
      status: CampaignStatus.LIVE,
      format: CampaignFormat.LANDING_PAGE,
      headline: 'My favourite new festival just dropped — Neon Tide.',
      description: 'Two days on the beach with the best lineup of the summer. Grab tickets through my link.',
      accentColor: '#0FB5BA',
    },
    create: {
      creatorId: creators[0].id,
      eventId: neonTide.id,
      slug: 'maya-neon-tide',
      status: CampaignStatus.LIVE,
      format: CampaignFormat.LANDING_PAGE,
      headline: 'My favourite new festival just dropped — Neon Tide.',
      description: 'Two days on the beach with the best lineup of the summer. Grab tickets through my link.',
      accentColor: '#0FB5BA',
    },
  });

  const neonChannelSeeds = [
    { channel: Channel.INSTAGRAM, landingType: LandingType.LANDING, code: 'maya-neon-ig', utmSource: 'instagram', clicks: 360 },
    { channel: Channel.TIKTOK, landingType: LandingType.LANDING, code: 'maya-neon-tt', utmSource: 'tiktok', clicks: 180 },
    { channel: Channel.NEWSLETTER, landingType: LandingType.SHORT, code: 'maya-neon-news', utmSource: 'newsletter', clicks: 72 },
  ];

  const neonChannels = [];
  for (const link of neonChannelSeeds) {
    const channelLink = await prisma.channelLink.upsert({
      where: { campaignId_channel_landingType: { campaignId: neonCampaign.id, channel: link.channel, landingType: link.landingType } },
      update: { code: link.code },
      create: {
        campaignId: neonCampaign.id,
        channel: link.channel,
        landingType: link.landingType,
        code: link.code,
        utmSource: link.utmSource,
        utmMedium: 'creator',
        utmCampaign: 'maya-neon-tide',
      },
    });
    neonChannels.push({ ...link, id: channelLink.id });
  }

  // Only simulate clicks/orders the first time (avoid duplicating on re-seed).
  const existingNeonClicks = await prisma.clickEvent.count({ where: { campaignId: neonCampaign.id } });
  if (existingNeonClicks === 0) {
    const neonTiers = await prisma.ticketTier.findMany({ where: { eventId: neonTide.id }, orderBy: { sortOrder: 'asc' } });
    let orderSeq = 0;
    for (const link of neonChannels) {
      const clickRows = Array.from({ length: link.clicks }).map((_, i) => ({
        channelLinkId: link.id,
        campaignId: neonCampaign.id,
        creatorId: creators[0].id,
        eventId: neonTide.id,
        ipHash: `seed-${link.code}-${i}`,
        uaHash: `seed-ua-${link.code}-${i}`,
        referrer: link.utmSource,
        landingUrl: `https://hypelist.app/c/maya.rodriguez/maya-neon-tide`,
      }));
      await prisma.clickEvent.createMany({ data: clickRows });

      // ~7% of clicks convert to an attributed order.
      const orderCount = Math.round(link.clicks * 0.07);
      const channelClicks = await prisma.clickEvent.findMany({
        where: { channelLinkId: link.id },
        take: orderCount,
        select: { id: true },
      });
      for (const click of channelClicks) {
        const tier = neonTiers[orderSeq % neonTiers.length];
        const gross = tier.priceCents;
        const commissionBps = neonTide.defaultCommissionBps;
        const commissionAmountCents = Math.round((gross * commissionBps) / 10000);
        const order = await prisma.order.create({
          data: {
            eventId: neonTide.id,
            ticketingProvider: TicketingProvider.TIXR,
            externalId: `neon-tide-seed-${orderSeq}`,
            grossAmountCents: gross,
            purchasedAt: new Date(Date.now() - orderSeq * 36e5),
            attributedCampaignId: neonCampaign.id,
            attributedClickId: click.id,
            attributedCreatorId: creators[0].id,
          },
        });
        await prisma.commissionLedger.create({
          data: {
            creatorId: creators[0].id,
            eventId: neonTide.id,
            campaignId: neonCampaign.id,
            orderId: order.id,
            status: orderSeq % 3 === 0 ? LedgerStatus.PENDING : LedgerStatus.CLEARED,
            commissionAmountCents,
            commissionBps,
            availableAt: new Date(Date.now() + 7 * 24 * 36e5),
          },
        });
        orderSeq += 1;
      }
    }

    await prisma.event.update({
      where: { id: neonTide.id },
      data: { soldCount: orderSeq, inventoryUpdatedAt: new Date() },
    });
    console.log(`Neon Tide demo: seeded clicks across ${neonChannels.length} channels and ${orderSeq} attributed orders`);
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

