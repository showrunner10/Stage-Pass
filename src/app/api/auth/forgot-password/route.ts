import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { canSendMail, sendMail } from '@/lib/server/mail';
import { canUseSupabaseAdmin } from '@/lib/server/supabase-admin';
import { hashWithSalt } from '@/lib/tracking/crypto';

const BodySchema = z.object({ email: z.string().trim().email() });

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!canSendMail()) {
    return NextResponse.json({ error: 'SMTP is not configured yet.' }, { status: 500 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is missing.' }, { status: 500 });
  }

  const email = parsed.data.email.toLowerCase();
  const sessionKey = `password_reset:${email}`;
  const now = Date.now();

  try {
    const existing = await prisma.campaignDraft.findUnique({
      where: { sessionKey },
      select: { data: true },
    });

    const existingData = (existing?.data as Record<string, unknown> | undefined) ?? {};
    const requestedAt = typeof existingData.requestedAt === 'string' ? Date.parse(existingData.requestedAt) : null;
    if (requestedAt && now - requestedAt < 60_000) {
      return NextResponse.json({ error: 'Please wait a minute before requesting another code.' }, { status: 429 });
    }

    const code = generateCode();
    const expiresAt = new Date(now + 10 * 60_000).toISOString();

    await prisma.campaignDraft.upsert({
      where: { sessionKey },
      create: {
        sessionKey,
        data: {
          type: 'PASSWORD_RESET_OTP',
          email,
          codeHash: hashWithSalt(`password-reset:${code}`),
          expiresAt,
          requestedAt: new Date(now).toISOString(),
          attempts: 0,
        },
      },
      update: {
        data: {
          type: 'PASSWORD_RESET_OTP',
          email,
          codeHash: hashWithSalt(`password-reset:${code}`),
          expiresAt,
          requestedAt: new Date(now).toISOString(),
          attempts: 0,
        },
      },
    });

    await sendMail({
      to: email,
      subject: 'Your Hypelist password reset code',
      text:
        `Your Hypelist password reset code is ${code}.\n\n` +
        `This code expires in 10 minutes.\n` +
        `If you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>Your Hypelist password reset code</h2>
          <p>Use this code to reset your password:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:6px;padding:16px 20px;background:#f3f4f6;border-radius:12px;display:inline-block">
            ${code}
          </div>
          <p style="margin-top:16px">This code expires in 10 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, message: 'A 6-digit reset code has been sent to your email.' });
  } catch {
    return NextResponse.json({ error: 'Could not send reset code right now.' }, { status: 500 });
  }
}
