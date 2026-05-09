import { NextResponse } from 'next/server';
import { canSendMail, sendMail, supportInbox } from '@/lib/server/mail';

function requireAdmin(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const roleMatch = cookie.split(';').map((v) => v.trim()).find((v) => v.startsWith('sp_role='));
  const role = roleMatch?.split('=')[1];
  return role === 'admin' || role === 'promoter';
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canSendMail()) {
    return NextResponse.json({ error: 'SMTP is not configured yet.' }, { status: 500 });
  }

  const inbox = supportInbox();
  await sendMail({
    to: inbox,
    subject: 'Stagepass SMTP test',
    text: 'This is a Stagepass SMTP test email.',
    html: '<div style="font-family:Arial,sans-serif"><h2>Stagepass SMTP test</h2><p>This is a Stagepass SMTP test email.</p></div>',
  });

  return NextResponse.json({ ok: true, sentTo: inbox });
}
