import { DashboardShell } from '@/components/layout/DashboardShell';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import { Button } from '@/components/ui/button';
import { getCreatorAppSnapshot } from '@/lib/server/creator-app';

export default async function MyCampaigns() {
  const snapshot = await getCreatorAppSnapshot();
  const rows = snapshot.campaigns;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">My Campaigns</h1>
            <p className="text-offwhite/40">Draft, launch, and track performance.</p>
          </div>
          <Button variant="premium" asChild>
            <Link href="/app/builder">New campaign</Link>
          </Button>
        </div>

        <div className="lg:hidden space-y-3">
          {rows.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div>
                <div className="text-white font-semibold leading-tight">{campaign.name}</div>
                <div className="text-xs text-offwhite/40">{campaign.eventTitle}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Status</div>
                  <CampaignStatusBadge status={campaign.status} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Conv.</div>
                  <div className="text-offwhite/85">{campaign.conversionRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Clicks</div>
                  <div className="text-offwhite/85">{campaign.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Tickets</div>
                  <div className="text-offwhite/85">{campaign.ticketsSold}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Revenue</div>
                  <div className="text-offwhite/85">{formatCurrency(campaign.revenue)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Commission</div>
                  <div className="text-accent-green font-semibold">{formatCurrency(campaign.commission)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/app/campaigns/${campaign.id}`}>
                  <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5 h-8 px-3 text-sm">
                    View
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full text-offwhite/60 hover:text-white h-8 px-3 text-sm" disabled>
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
              {rows.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{campaign.name}</span>
                      <span className="text-xs text-offwhite/40">{campaign.eventTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{campaign.ticketsSold}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                  <TableCell className="text-right text-accent-green font-semibold">
                    {formatCurrency(campaign.commission)}
                  </TableCell>
                  <TableCell className="text-right">{campaign.conversionRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/app/campaigns/${campaign.id}`}>
                        <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 h-9 px-3">
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" className="text-offwhite/60 hover:text-white h-9 px-3" disabled>
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
