import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentCreatorProfile, getCurrentUserEmail } from '@/lib/server/current-user';

const SettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(500).optional().default(''),
  instagramHandle: z.string().trim().max(200).optional().default(''),
  tiktokHandle: z.string().trim().max(200).optional().default(''),
  audience: z.string().trim().max(40).optional().default(''),
  notifications: z.record(z.boolean()).optional().default({}),
  bankData: z.object({
    accountName: z.string().trim().max(120),
    bsb: z.string().trim().max(40),
    accountNumber: z.string().trim().max(80),
  }),
});

function settingsKey(creatorId: string) {
  return `creator_settings:${creatorId}`;
}

export async function GET() {
  const [creator, email] = await Promise.all([getCurrentCreatorProfile(), getCurrentUserEmail()]);
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
  }

  const settings = await prisma.campaignDraft.findUnique({
    where: { sessionKey: settingsKey(creator.id) },
    select: { data: true },
  }).catch(() => null);

  const meta = (settings?.data as Record<string, unknown> | undefined) ?? {};
  return NextResponse.json({
    item: {
      displayName: creator.displayName,
      email: email ?? creator.user.email,
      bio: creator.bio ?? '',
      instagramHandle: String(meta.instagramHandle ?? `@${creator.handle}`),
      tiktokHandle: String(meta.tiktokHandle ?? `@${creator.handle.replace(/\./g, '')}`),
      audience: creator.audienceSize?.toString() ?? '',
      notifications: (meta.notifications as Record<string, boolean> | undefined) ?? {
        'New event launches': true,
        'Campaign performance updates': true,
        'Payout notifications': true,
        'Promotional emails': false,
      },
      bankData: (meta.bankData as Record<string, string> | undefined) ?? {
        accountName: creator.displayName,
        bsb: '',
        accountNumber: '',
      },
    },
  });
}

export async function PATCH(req: Request) {
  const creator = await getCurrentCreatorProfile();
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid settings payload.' }, { status: 400 });
  }

  const data = parsed.data;
  const audienceSize = Number.parseInt(data.audience.replace(/[^\d]/g, ''), 10);

  await prisma.$transaction([
    prisma.creatorProfile.update({
      where: { id: creator.id },
      data: {
        displayName: data.displayName,
        bio: data.bio || null,
        audienceSize: Number.isFinite(audienceSize) ? audienceSize : null,
      },
    }),
    prisma.campaignDraft.upsert({
      where: { sessionKey: settingsKey(creator.id) },
      create: {
        sessionKey: settingsKey(creator.id),
        creatorId: creator.id,
        data,
      },
      update: {
        data,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
