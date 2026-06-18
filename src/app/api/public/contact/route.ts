import { NextResponse } from 'next/server';
import { z } from 'zod';
import { canSendMail, sendMail, supportInbox } from '@/lib/server/mail';

const BodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  companyRole: z.string().trim().min(2).max(160),
  audience: z.enum(['creator', 'promoter', 'other']),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(4000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }

    if (!canSendMail()) {
      return NextResponse.json({ error: 'SMTP is not configured yet.' }, { status: 500 });
    }

    const data = parsed.data;
    const inbox = supportInbox();
    const audienceLabel = data.audience.charAt(0).toUpperCase() + data.audience.slice(1);

    await Promise.all([
      sendMail({
        to: inbox,
        replyTo: data.email,
        subject: `[Hypelist Contact] ${data.subject}`,
        text:
          `New contact submission\n\n` +
          `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Company/Role: ${data.companyRole}\n` +
          `Audience: ${audienceLabel}\n\n` +
          `${data.message}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2 style="margin:0 0 16px">New Hypelist contact submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Company / Role:</strong> ${escapeHtml(data.companyRole)}</p>
            <p><strong>Audience:</strong> ${escapeHtml(audienceLabel)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
            <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
          </div>
        `,
      }),
      sendMail({
        to: data.email,
        subject: 'We received your Hypelist message',
        text:
          `Hi ${data.name},\n\n` +
          `We received your message about "${data.subject}". ` +
          `Our team will reply from ${inbox} as soon as possible.\n\n` +
          `Hypelist`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2 style="margin:0 0 16px">We received your message</h2>
            <p>Hi ${escapeHtml(data.name)},</p>
            <p>We received your message about <strong>${escapeHtml(data.subject)}</strong>.</p>
            <p>Our team will reply from <strong>${escapeHtml(inbox)}</strong> as soon as possible.</p>
            <p style="margin-top:24px">Hypelist</p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not send message right now.' }, { status: 500 });
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
