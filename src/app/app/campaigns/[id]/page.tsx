'use client';

import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { campaigns, events } from '@/data/mock';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CampaignDetail() {
  const params = useParams<{ id: string }>();
  const campaign = campaigns.find((c) => c.id === params.id);

  if (!campaign) {
    return (
      <DashboardShell>
        <div className="text-offwhite/60">Campaign not found.</div>
      </DashboardShell>
    );
  }

  const event = events.find((e) => e.id === campaign.eventId);

  const channels = [
    { channel: 'Instagram', clicks: Math.round(campaign.clicks * 0.46), tickets: Math.round(campaign.ticketsSold * 0.52) },
    { channel: 'TikTok', clicks: Math.round(campaign.clicks * 0.34), tickets: Math.round(campaign.ticketsSold * 0.28) },
    { channel: 'Newsletter', clicks: Math.round(campaign.clicks * 0.2), tickets: Math.round(campaign.ticketsSold * 0.2) },
  ];

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
              {event?.title ?? 'Event'} · {campaign.format}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
              Pause
            </Button>
            <Button variant="ghost" className="text-offwhite/60 hover:text-white">
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
              <h2 className="text-xl font-bold text-white">Clicks chart</h2>
              <p className="text-sm text-offwhite/40">Placeholder — production analytics planned.</p>
            </div>
          </div>
          <div className="h-48 rounded-xl bg-dark border border-white/10 flex items-center justify-center text-offwhite/40">
            Chart placeholder
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">Channel performance</h2>
              <p className="text-sm text-offwhite/40">Mock breakdown for demo.</p>
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
                {channels.map((row) => (
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
              <p className="text-sm text-offwhite/40">Prototype attribution URLs.</p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">Short link</div>
              <div className="text-sm text-offwhite/80 break-all bg-dark border border-white/10 rounded-xl p-4">
                {`/go/maya/${campaign.slug}?utm_source=instagram&utm_medium=creator&utm_campaign=${campaign.slug}`}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">Landing preview</div>
              <div className="rounded-xl bg-dark border border-white/10 p-4">
                <div className="text-white font-semibold">{campaign.headline}</div>
                <div className="text-sm text-offwhite/50 mt-1 line-clamp-3">{campaign.note}</div>
                <div className="mt-4 flex gap-3">
                  <Link href={`/c/maya/${campaign.slug}`} className="flex-1">
                    <Button variant="premium" className="w-full">
                      Open landing page
                    </Button>
                  </Link>
                  <Link href={`/go/maya/${campaign.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5">
                      Redirect demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-offwhite/30">
          Production tracking service planned. Stripe Connect planned. Tixr API connection planned.
        </div>
      </div>
    </DashboardShell>
  );
}
