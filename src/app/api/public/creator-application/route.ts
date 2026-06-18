import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { canSendMail, sendMail, supportInbox } from '@/lib/server/mail';

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

    if (canSendMail()) {
      const inbox = supportInbox();
      await Promise.allSettled([
        sendMail({
          to: inbox,
          replyTo: email,
          subject: `[Hypelist Creator Application] ${parsed.data.fullName}`,
          text:
            `New creator application\n\n` +
            `Name: ${parsed.data.fullName}\n` +
            `Email: ${email}\n` +
            `Niche: ${parsed.data.niche}\n` +
            `City/Region: ${parsed.data.cityRegion}\n` +
            `Audience: ${parsed.data.audienceSize || 'Not provided'}\n` +
            `Instagram: ${parsed.data.instagram || '-'}\n` +
            `TikTok: ${parsed.data.tiktok || '-'}\n` +
            `YouTube: ${parsed.data.youtube || '-'}\n\n` +
            `Sample links:\n${parsed.data.sampleLinks}\n\n` +
            `Account age note:\n${parsed.data.accountAgeNote || '-'}`,
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
              <h2>New creator application</h2>
              <p><strong>Name:</strong> ${escapeHtml(parsed.data.fullName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Niche:</strong> ${escapeHtml(parsed.data.niche)}</p>
              <p><strong>City / Region:</strong> ${escapeHtml(parsed.data.cityRegion)}</p>
              <p><strong>Audience:</strong> ${escapeHtml(parsed.data.audienceSize || 'Not provided')}</p>
              <p><strong>Instagram:</strong> ${escapeHtml(parsed.data.instagram || '-')}</p>
              <p><strong>TikTok:</strong> ${escapeHtml(parsed.data.tiktok || '-')}</p>
              <p><strong>YouTube:</strong> ${escapeHtml(parsed.data.youtube || '-')}</p>
              <p><strong>Sample links:</strong><br />${escapeHtml(parsed.data.sampleLinks).replaceAll('\n', '<br />')}</p>
              <p><strong>Account age note:</strong><br />${escapeHtml(parsed.data.accountAgeNote || '-')}</p>
            </div>
          `,
        }),
        sendMail({
          to: email,
          subject: 'Your Hypelist creator application is in',
          text:
            `Hi ${parsed.data.fullName},\n\n` +
            `We received your Hypelist creator application. ` +
            `Our team will review it and reply from ${inbox} when there is an update.\n\n` +
            `Hypelist`,
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
              <h2>Your Hypelist creator application is in</h2>
              <p>Hi ${escapeHtml(parsed.data.fullName)},</p>
              <p>We received your Hypelist creator application.</p>
              <p>Our team will review it and reply from <strong>${escapeHtml(inbox)}</strong> when there is an update.</p>
              <p style="margin-top:24px">Hypelist</p>
            </div>
          `,
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save application. Try again later.' }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
