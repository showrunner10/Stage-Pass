import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashWithSalt } from '@/lib/tracking/crypto';
import { updateSupabasePasswordByEmail } from '@/lib/server/supabase-admin';

const BodySchema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code.'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid reset details';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const sessionKey = `password_reset:${email}`;

  try {
    const draft = await prisma.campaignDraft.findUnique({
      where: { sessionKey },
      select: { id: true, data: true },
    });

    const data = (draft?.data as Record<string, unknown> | undefined) ?? null;
    if (!draft || !data) {
      return NextResponse.json({ error: 'Reset code not found. Request a new code.' }, { status: 404 });
    }

    const expiresAt = typeof data.expiresAt === 'string' ? Date.parse(data.expiresAt) : NaN;
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      await prisma.campaignDraft.delete({ where: { sessionKey } }).catch(() => null);
      return NextResponse.json({ error: 'Reset code expired. Request a new code.' }, { status: 400 });
    }

    const attempts = typeof data.attempts === 'number' ? data.attempts : 0;
    if (attempts >= 5) {
      return NextResponse.json({ error: 'Too many invalid attempts. Request a new code.' }, { status: 429 });
    }

    const expectedHash = typeof data.codeHash === 'string' ? data.codeHash : '';
    const incomingHash = hashWithSalt(`password-reset:${parsed.data.code}`);
    if (!expectedHash || incomingHash !== expectedHash) {
      await prisma.campaignDraft.update({
        where: { sessionKey },
        data: {
          data: { ...data, attempts: attempts + 1 },
        },
      });
      return NextResponse.json({ error: 'Incorrect reset code.' }, { status: 400 });
    }

    await updateSupabasePasswordByEmail(email, parsed.data.newPassword);
    await prisma.campaignDraft.delete({ where: { sessionKey } }).catch(() => null);

    return NextResponse.json({ ok: true, message: 'Password updated. You can now sign in.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reset password';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
