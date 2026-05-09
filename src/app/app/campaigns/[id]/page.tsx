import { DashboardShell } from '@/components/layout/DashboardShell';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCreatorAppSnapshot } from '@/lib/server/creator-app';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetail({ params }: PageProps) {
  const resolvedParams = await params;
  const snapshot = await getCreatorAppSnapshot();
  const campaign = snapshot.campaigns.find((entry) => entry.id === resolvedParams.id);

  if (!campaign) {
    return (
      <DashboardShell>
        <div className="text-offwhite/60">Campaign not found.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white">{campaign.name}</h1>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="text-offwhite/40">
              {campaign.eventTitle} · {campaign.format}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5" disabled>
              Pause
            </Button>
            <Button variant="ghost" className="text-offwhite/60 hover:text-white" disabled>
              Archive
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Clicks</div>
            <div className="text-4xl font-black text-white">{campaign.clicks.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Tickets sold</div>
            <div className="text-4xl font-black text-white">{campaign.ticketsSold}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Commission</div>
            <div className="text-4xl font-black text-accent-green">{formatCurrency(campaign.commission)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Performance snapshot</h2>
              <p className="text-sm text-offwhite/40">Live data from tracked clicks, orders, and commission rows.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-dark border border-white/10 p-4">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Revenue</div>
              <div className="text-2xl font-black text-white">{formatCurrency(campaign.revenue)}</div>
            </div>
            <div className="rounded-xl bg-dark border border-white/10 p-4">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Conversion</div>
              <div className="text-2xl font-black text-white">{campaign.conversionRate.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl bg-dark border border-white/10 p-4">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Landing</div>
              <div className="text-sm font-semibold text-white break-all">/{campaign.creatorHandle}/{campaign.slug}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">Channel performance</h2>
              <p className="text-sm text-offwhite/40">Breakdown from generated channel links.</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.channelBreakdown.map((row) => (
                  <TableRow key={row.channel}>
                    <TableCell className="text-white font-medium">{row.channel}</TableCell>
                    <TableCell className="text-right">{row.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.tickets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Generated links</h2>
              <p className="text-sm text-offwhite/40">Campaign URLs ready for creator distribution.</p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">Short link</div>
              <div className="text-sm text-offwhite/80 break-all bg-dark border border-white/10 rounded-xl p-4">
                {`/go/${campaign.creatorHandle}/${campaign.slug}?utm_source=instagram&utm_medium=creator&utm_campaign=${campaign.slug}`}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">Landing preview</div>
              <div className="rounded-xl bg-dark border border-white/10 p-4">
                <div className="text-white font-semibold">{campaign.headline}</div>
                <div className="text-sm text-offwhite/50 mt-1 line-clamp-3">{campaign.note || 'No custom note yet.'}</div>
                <div className="mt-4 flex gap-3">
                  <Link href={`/c/${campaign.creatorHandle}/${campaign.slug}`} className="flex-1">
                    <Button variant="premium" className="w-full">
                      Open landing page
                    </Button>
                  </Link>
                  <Link href={`/go/${campaign.creatorHandle}/${campaign.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5">
                      Redirect demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
