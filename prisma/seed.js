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
    { email: 'maya@stagepass.app', clerkId: 'seed_creator_maya', handle: 'maya.rodriguez', displayName: 'Maya Rodriguez', niche: 'Music & Lifestyle', audienceSize: 125000, tier: CreatorTier.HEADLINE },
    { email: 'alex@stagepass.app', clerkId: 'seed_creator_alex', handle: 'alextalksevents', displayName: 'Alex Chen', niche: 'Nightlife & Culture', audienceSize: 45000, tier: CreatorTier.ESTABLISHED },
    { email: 'sarah@stagepass.app', clerkId: 'seed_creator_sarah', handle: 'sarah.j', displayName: 'Sarah Jenkins', niche: 'Food & Wine', audienceSize: 82000, tier: CreatorTier.ESTABLISHED },
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

  const campaign = await prisma.campaign.upsert({
    where: { creatorId_slug: { creatorId: creators[0].id, slug: 'maya-solstice' } },
    update: {
      eventId: createdEvents[0].id,
      status: CampaignStatus.LIVE,
      format: CampaignFormat.LANDING_PAGE,
      headline: 'Join me at this one.',
      description: 'A campaign-ready launch page for Solstice.',
      accentColor: '#1969FF',
    },
    create: {
      creatorId: creators[0].id,
      eventId: createdEvents[0].id,
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

