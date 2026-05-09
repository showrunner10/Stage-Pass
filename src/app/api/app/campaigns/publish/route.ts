import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentCreatorProfile } from '@/lib/server/current-user';
import { Channel, LandingType } from '@prisma/client';

const cookieName = 'sp_builder_session';

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq);
    if (key !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

const BodySchema = z.object({
  selectedEventId: z.string().min(1),
  format: z.enum(['Tracked link', 'Landing page']),
  slug: z.string().trim().min(1).max(80),
  headline: z.string().trim().max(140).optional().default(''),
  note: z.string().trim().max(1000).optional().default(''),
  accent: z.enum(['Primary', 'Green']).optional().default('Primary'),
  channels: z.record(z.boolean()).default({}),
});

function normalizeChannel(input: string) {
  if (input === 'Instagram') return Channel.INSTAGRAM;
  if (input === 'TikTok') return Channel.TIKTOK;
  if (input === 'Newsletter') return Channel.NEWSLETTER;
  if (input === 'Podcast') return Channel.PODCAST;
  if (input === 'QR Code') return Channel.QR;
  return Channel.OTHER;
}

function buildCode(handle: string, slug: string, channel: string) {
  return `${handle.replace(/\./g, '-')}-${slug}-${channel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 64);
}

export async function POST(req: Request) {
  const creator = await getCurrentCreatorProfile();
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid campaign payload.' }, { status: 400 });
  }

  const data = parsed.data;
  const existingHandle = await prisma.campaign.findFirst({
    where: {
      creatorId: creator.id,
      slug: data.slug,
    },
    select: { id: true },
  });

  const selectedChannels = Object.entries(data.channels)
    .filter(([, enabled]) => enabled)
    .map(([label]) => label);

  const campaign = await prisma.$transaction(async (tx) => {
    const saved = existingHandle
      ? await tx.campaign.update({
          where: { id: existingHandle.id },
          data: {
            eventId: data.selectedEventId,
            status: 'LIVE',
            format: data.format === 'Landing page' ? 'LANDING_PAGE' : 'TRACKED_LINK',
            slug: data.slug,
            headline: data.headline || null,
            description: data.note || null,
            accentColor: data.accent === 'Green' ? '#1D9E75' : '#534AB7',
          },
        })
      : await tx.campaign.create({
          data: {
            creatorId: creator.id,
            eventId: data.selectedEventId,
            status: 'LIVE',
            format: data.format === 'Landing page' ? 'LANDING_PAGE' : 'TRACKED_LINK',
            slug: data.slug,
            headline: data.headline || null,
            description: data.note || null,
            accentColor: data.accent === 'Green' ? '#1D9E75' : '#534AB7',
          },
        });

    await tx.channelLink.deleteMany({ where: { campaignId: saved.id } });

    if (selectedChannels.length > 0) {
      await tx.channelLink.createMany({
        data: selectedChannels.map((label) => ({
          campaignId: saved.id,
          channel: normalizeChannel(label),
          landingType: data.format === 'Landing page' ? LandingType.LANDING : LandingType.SHORT,
          code: buildCode(creator.handle, data.slug, label),
          utmSource: label.toLowerCase().replace(/\s+/g, '-'),
          utmMedium: 'creator',
          utmCampaign: data.slug,
        })),
      });
    }

    const cookieHeader = req.headers.get('cookie');
    const sessionKey = getCookieValue(cookieHeader, cookieName);
    if (sessionKey) {
      await tx.campaignDraft.upsert({
        where: { sessionKey },
        create: { sessionKey, creatorId: creator.id, campaignId: saved.id, data: { ...data, published: true } },
        update: { creatorId: creator.id, campaignId: saved.id, data: { ...data, published: true } },
      });
    }

    return saved;
  });

  return NextResponse.json({ ok: true, campaignId: campaign.id });
}
