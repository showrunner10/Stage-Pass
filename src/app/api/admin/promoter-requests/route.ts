import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { canSendMail, sendMail, supportInbox } from '@/lib/server/mail';

function requireAdmin(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const roleMatch = cookie.split(';').map((v) => v.trim()).find((v) => v.startsWith('sp_role='));
  const role = roleMatch?.split('=')[1];
  return role === 'admin';
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await prisma.campaignDraft.findMany({
      where: { sessionKey: { startsWith: 'promoter_request:' } },
      orderBy: { updatedAt: 'desc' },
      select: { sessionKey: true, creatorId: true, data: true, updatedAt: true },
    });

    const items = rows.map((row) => {
      const data = (row.data as Record<string, unknown>) ?? {};
      return {
        requestId: row.sessionKey,
        userId: row.creatorId,
        email: String(data.email ?? ''),
        displayName: String(data.displayName ?? ''),
        orgName: String(data.orgName ?? ''),
        status: String(data.status ?? 'PENDING'),
        requestedAt: String(data.requestedAt ?? row.updatedAt.toISOString()),
      };
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

const DecisionSchema = z.object({
  requestId: z.string().min(1),
  decision: z.enum(['approve', 'reject']),
});

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = DecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { requestId, decision } = parsed.data;

  const draft = await prisma.campaignDraft.findUnique({
    where: { sessionKey: requestId },
    select: { creatorId: true, data: true },
  });

  if (!draft?.creatorId) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const data = (draft.data as Record<string, unknown>) ?? {};
  const orgName = String(data.orgName ?? 'Promoter Org');
  const email = String(data.email ?? '');
  const displayName = String(data.displayName ?? 'there');

  if (decision === 'approve') {
    const user = await prisma.user.update({
      where: { id: draft.creatorId },
      data: { role: 'PROMOTER' },
      select: { id: true },
    });

    const baseSlug = slugify(orgName) || `org-${user.id.slice(0, 6)}`;
    const existing = await prisma.promoterOrg.findUnique({ where: { slug: baseSlug }, select: { id: true } });
    const org = existing
      ? await prisma.promoterOrg.findUniqueOrThrow({ where: { slug: baseSlug } })
      : await prisma.promoterOrg.create({
          data: {
            name: orgName,
            slug: `${baseSlug}-${user.id.slice(0, 4)}`,
            createdById: user.id,
          },
        });

    await prisma.promoterOrgMember.upsert({
      where: { orgId_userId: { orgId: org.id, userId: user.id } },
      update: { role: 'OWNER' },
      create: {
        orgId: org.id,
        userId: user.id,
        role: 'OWNER',
      },
    });
  }

  await prisma.campaignDraft.update({
    where: { sessionKey: requestId },
    data: {
      data: {
        ...data,
        status: decision === 'approve' ? 'APPROVED' : 'REJECTED',
        decidedAt: new Date().toISOString(),
      },
    },
  });

  if (canSendMail() && email) {
    const inbox = supportInbox();
    const approved = decision === 'approve';
    await sendMail({
      to: email,
      subject: approved ? 'Your Stagepass promoter access is approved' : 'Your Stagepass promoter request update',
      text: approved
        ? `Hi ${displayName},\n\nYour Stagepass promoter request for ${orgName} has been approved. You can now sign in and access promoter admin.\n\nQuestions? Reply to ${inbox}.\n\nStagepass`
        : `Hi ${displayName},\n\nWe reviewed your Stagepass promoter request for ${orgName}. It was not approved at this stage.\n\nIf you need help or want to provide more context, reply to ${inbox}.\n\nStagepass`,
      html: approved
        ? `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827"><h2>Promoter access approved</h2><p>Hi ${escapeHtml(displayName)},</p><p>Your Stagepass promoter request for <strong>${escapeHtml(orgName)}</strong> has been approved.</p><p>You can now sign in and access promoter admin.</p><p>Questions? Reply to <strong>${escapeHtml(inbox)}</strong>.</p><p style="margin-top:24px">Stagepass</p></div>`
        : `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827"><h2>Promoter request update</h2><p>Hi ${escapeHtml(displayName)},</p><p>We reviewed your Stagepass promoter request for <strong>${escapeHtml(orgName)}</strong>. It was not approved at this stage.</p><p>If you need help or want to provide more context, reply to <strong>${escapeHtml(inbox)}</strong>.</p><p style="margin-top:24px">Stagepass</p></div>`,
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
