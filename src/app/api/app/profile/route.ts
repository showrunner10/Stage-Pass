import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentCreatorProfile, getCurrentUserEmail } from '@/lib/server/current-user';

const ProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  handle: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-zA-Z0-9._-]+$/),
  bio: z.string().trim().max(500).optional().default(''),
  niche: z.string().trim().max(120).optional().default(''),
  audienceSize: z.string().trim().max(40).optional().default(''),
  instagram: z.string().trim().max(200).optional().default(''),
  tiktok: z.string().trim().max(200).optional().default(''),
  youtube: z.string().trim().max(240).optional().default(''),
});

function settingsKey(creatorId: string) {
  return `creator_profile:${creatorId}`;
}

function deriveHandleFromEmail(email: string) {
  return (
    email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'creator.handle'
  );
}

async function ensureCreatorForCurrentUser() {
  const creator = await getCurrentCreatorProfile();
  if (creator) return creator;

  const email = await getCurrentUserEmail();
  if (!email) return null;

  let user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  }).catch(() => null);

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: `fallback_${email.replace(/[^a-z0-9]+/gi, '_')}`,
        email,
        role: 'CREATOR',
      },
      select: { id: true, role: true },
    }).catch(() => null);
  }

  if (!user || user.role !== 'CREATOR') return null;

  let handle = deriveHandleFromEmail(email);
  let counter = 1;
  while (await prisma.creatorProfile.findUnique({ where: { handle }, select: { id: true } }).catch(() => null)) {
    counter += 1;
    handle = `${deriveHandleFromEmail(email).slice(0, Math.max(1, 40 - String(counter).length - 1))}-${counter}`;
  }

  return prisma.creatorProfile.create({
    data: {
      userId: user.id,
      handle,
      displayName: email.split('@')[0],
      tier: 'DEFAULT',
    },
    include: { user: true },
  }).catch(() => null);
}

export async function GET() {
  const creator = await ensureCreatorForCurrentUser();
  if (!creator) {
    const email = await getCurrentUserEmail();
    const fallbackHandle = email ? deriveHandleFromEmail(email) : 'creator.handle';
    return NextResponse.json({
      item: {
        displayName: email?.split('@')[0] ?? '',
        handle: fallbackHandle,
        bio: '',
        niche: '',
        audienceSize: '',
        instagram: email ? `@${fallbackHandle}` : '',
        tiktok: email ? `@${fallbackHandle.replace(/\./g, '')}` : '',
        youtube: '',
      },
    });
  }

  const settings = await prisma.campaignDraft.findUnique({
    where: { sessionKey: settingsKey(creator.id) },
    select: { data: true },
  }).catch(() => null);

  const meta = (settings?.data as Record<string, unknown> | undefined) ?? {};
  return NextResponse.json({
    item: {
      displayName: creator.displayName,
      handle: creator.handle,
      bio: creator.bio ?? '',
      niche: creator.niche ?? '',
      audienceSize: creator.audienceSize?.toString() ?? '',
      instagram: String(meta.instagram ?? `@${creator.handle}`),
      tiktok: String(meta.tiktok ?? `@${creator.handle.replace(/\./g, '')}`),
      youtube: String(meta.youtube ?? ''),
    },
  });
}

export async function PATCH(req: Request) {
  const creator = await ensureCreatorForCurrentUser();
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile data.' }, { status: 400 });
  }

  const data = parsed.data;
  const normalizedHandle = data.handle.toLowerCase();
  const existing = await prisma.creatorProfile.findFirst({
    where: {
      handle: normalizedHandle,
      NOT: { id: creator.id },
    },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: 'Handle already taken.' }, { status: 409 });
  }

  const audienceSize = Number.parseInt(data.audienceSize.replace(/[^\d]/g, ''), 10);

  await prisma.$transaction([
    prisma.creatorProfile.update({
      where: { id: creator.id },
      data: {
        displayName: data.displayName,
        handle: normalizedHandle,
        bio: data.bio || null,
        niche: data.niche || null,
        audienceSize: Number.isFinite(audienceSize) ? audienceSize : null,
      },
    }),
    prisma.campaignDraft.upsert({
      where: { sessionKey: settingsKey(creator.id) },
      create: {
        sessionKey: settingsKey(creator.id),
        creatorId: creator.id,
        data: {
          instagram: data.instagram,
          tiktok: data.tiktok,
          youtube: data.youtube,
        },
      },
      update: {
        data: {
          instagram: data.instagram,
          tiktok: data.tiktok,
          youtube: data.youtube,
        },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
