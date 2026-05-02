import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const BodySchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  instagram: z.string().max(200).optional().or(z.literal('')),
  tiktok: z.string().max(200).optional().or(z.literal('')),
  youtube: z.string().max(200).optional().or(z.literal('')),
  audienceSize: z.string().max(80).optional().or(z.literal('')),
  niche: z.string().min(1).max(120),
  cityRegion: z.string().min(1).max(120),
  sampleLinks: z.string().min(1).max(4000),
  accountAgeNote: z.string().max(500).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check all required fields.' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const sessionKey = `creator_application:${email}`;

    const payload = {
      type: 'CREATOR_APPLICATION' as const,
      status: 'PENDING' as const,
      submittedAt: new Date().toISOString(),
      ...parsed.data,
      email,
    };

    await prisma.campaignDraft.upsert({
      where: { sessionKey },
      create: { sessionKey, data: payload },
      update: { data: payload },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save application. Try again later.' }, { status: 500 });
  }
}
