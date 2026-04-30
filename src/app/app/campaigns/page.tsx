'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { campaigns, events } from '@/data/mock';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import { Button } from '@/components/ui/button';

export default function MyCampaigns() {
  const rows = campaigns.map((c) => {
    const event = events.find((e) => e.id === c.eventId);
    return { ...c, eventTitle: event?.title ?? 'Event' };
  });

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">My Campaigns</h1>
            <p className="text-offwhite/40">Draft, launch, and track performance.</p>
          </div>
          <Link href="/app/builder">
            <Button variant="premium">New campaign</Button>
          </Link>
        </div>

        <div className="lg:hidden space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div>
                <div className="text-white font-semibold leading-tight">{c.name}</div>
                <div className="text-xs text-offwhite/40">{c.eventTitle}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Status</div>
                  <CampaignStatusBadge status={c.status} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Conv.</div>
                  <div className="text-offwhite/85">{c.conversionRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Clicks</div>
                  <div className="text-offwhite/85">{c.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Tickets</div>
                  <div className="text-offwhite/85">{c.ticketsSold}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Revenue</div>
                  <div className="text-offwhite/85">{formatCurrency(c.revenue)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Commission</div>
                  <div className="text-accent-green font-semibold">{formatCurrency(c.commission)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/app/campaigns/${c.id}`}>
                  <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5 h-8 px-3 text-sm">
                    View
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full text-offwhite/60 hover:text-white h-8 px-3 text-sm">
                  Archive
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Tickets</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{c.name}</span>
                      <span className="text-xs text-offwhite/40">{c.eventTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">{c.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{c.ticketsSold}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.revenue)}</TableCell>
                  <TableCell className="text-right text-accent-green font-semibold">
                    {formatCurrency(c.commission)}
                  </TableCell>
                  <TableCell className="text-right">{c.conversionRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/app/campaigns/${c.id}`}>
                        <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 h-9 px-3">
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" className="text-offwhite/60 hover:text-white h-9 px-3">
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  );
}
