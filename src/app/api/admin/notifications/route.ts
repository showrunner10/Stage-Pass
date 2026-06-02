import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function hasAdminAccess(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const roleMatch = cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith('sp_role='));
  const role = roleMatch?.split('=')[1];
  return role === 'admin' || role === 'promoter';
}

export async function GET(req: Request) {
  if (!hasAdminAccess(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await prisma.campaignDraft.findMany({
      where: {
        OR: [
          { sessionKey: { startsWith: 'creator_application:' } },
          { sessionKey: { startsWith: 'creator_lead:' } },
          { sessionKey: { startsWith: 'promoter_request:' } },
          { sessionKey: { startsWith: 'promoter_onboarding:' } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { sessionKey: true, data: true, updatedAt: true },
    });

    const items = rows.map((row) => {
      const data = (row.data as Record<string, unknown>) ?? {};
      const status = String(data.status ?? 'PENDING');
      const isCreatorApplication = row.sessionKey.startsWith('creator_application:');
      const isCreatorLead = row.sessionKey.startsWith('creator_lead:');
      const isPromoterRequest = row.sessionKey.startsWith('promoter_request:');
      const isPromoterOnboarding = row.sessionKey.startsWith('promoter_onboarding:');

      return {
        id: row.sessionKey,
        title: isCreatorApplication
          ? `Creator application: ${String(data.fullName ?? 'Applicant')}`
          : isCreatorLead
            ? `Creator lead: @${String(data.handle ?? 'creator')}`
            : isPromoterOnboarding
              ? `Promoter account: ${String(data.orgName ?? 'Organisation')}`
              : `Promoter request: ${String(data.orgName ?? 'Organisation')}`,
        detail: isPromoterRequest || isPromoterOnboarding
          ? `${String(data.email ?? 'No email')} · ${status}`
          : `${String(data.email ?? data.city ?? 'No email')} · ${status}`,
        href: isPromoterRequest || isPromoterOnboarding || isCreatorApplication ? '/admin/creators' : '/admin/dashboard',
        createdAt: row.updatedAt.toISOString(),
        unread: status === 'PENDING' || status === 'CAPTURED',
      };
    });

    return NextResponse.json({ items, unreadCount: items.filter((item) => item.unread).length });
  } catch {
    return NextResponse.json({ items: [], unreadCount: 0 });
  }
}
