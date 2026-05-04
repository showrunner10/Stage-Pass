import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const BodySchema = z.object({
  handle: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  category: z.enum(['Events', 'Festivals', 'Nightlife', 'Wellness']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 });
    }

    const normalizedHandle = parsed.data.handle.toLowerCase().replace(/^@+/, '');
    const sessionKey = `creator_lead:${normalizedHandle}`;
    const payload = {
      type: 'CREATOR_LEAD' as const,
      status: 'CAPTURED' as const,
      submittedAt: new Date().toISOString(),
      ...parsed.data,
      handle: normalizedHandle,
    };

    await prisma.campaignDraft.upsert({
      where: { sessionKey },
      create: { sessionKey, data: payload },
      update: { data: payload },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not capture lead.' }, { status: 500 });
  }
}
