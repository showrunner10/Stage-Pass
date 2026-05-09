import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/shared/MetricCard';
import { EventCard } from '@/components/shared/EventCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, DollarSign, Ticket, TrendingUp, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import { Button } from '@/components/ui/button';
import { getCreatorAppSnapshot } from '@/lib/server/creator-app';
import { getPublicEvents } from '@/lib/server/public-events';

export default async function CreatorDashboard() {
  const [snapshot, publicEvents] = await Promise.all([getCreatorAppSnapshot(), getPublicEvents()]);
  const topCampaigns = [...snapshot.campaigns].sort((a, b) => b.commission - a.commission).slice(0, 4);
  const newInMarketplace = publicEvents.slice(0, 3);
  const ticketsSold30d = snapshot.campaigns.reduce((sum, campaign) => sum + campaign.ticketsSold, 0);
  const commissionEarned = snapshot.campaigns.reduce((sum, campaign) => sum + campaign.commission, 0);
  const activeCampaigns = snapshot.campaigns.filter((campaign) => campaign.status === 'Live').length;
  const conversionRate =
    snapshot.campaigns.length === 0
      ? 0
      : snapshot.campaigns.reduce((sum, campaign) => sum + campaign.conversionRate, 0) / snapshot.campaigns.length;
  const activity = snapshot.ledger.slice(0, 6);

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <MetricCard
              title="Tickets sold (30d)"
              value={ticketsSold30d}
              description="Across your active promos"
              icon={<Ticket className="w-5 h-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
              title="Commission earned"
              value={formatCurrency(commissionEarned)}
              description="Clearing in 2-7 days"
              icon={<DollarSign className="w-5 h-5" />}
              trend={{ value: 8, isPositive: true }}
            />
            <MetricCard
              title="Active campaigns"
              value={activeCampaigns}
              description="Live now"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: 4, isPositive: true }}
            />
            <MetricCard
              title="Conversion rate"
              value={`${conversionRate.toFixed(1)}%`}
              description="Avg across campaigns"
              icon={<ArrowUpRight className="w-5 h-5" />}
              trend={{ value: 2, isPositive: true }}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Top performing campaigns</h2>
                <p className="text-sm text-offwhite/45">Commission, clicks, and conversion at a glance</p>
              </div>
              <Link href="/app/campaigns">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View all
                </Button>
              </Link>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Conv.</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{campaign.name}</span>
                        <span className="text-xs text-offwhite/40">{campaign.eventTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CampaignStatusBadge status={campaign.status} />
                    </TableCell>
                    <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.ticketsSold}</TableCell>
                    <TableCell className="text-right">{campaign.conversionRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right text-accent-green font-semibold">
                      {formatCurrency(campaign.commission)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">New in marketplace</h2>
                <p className="text-sm text-offwhite/45">Fresh events with premium commission</p>
              </div>
              <Link href="/app/marketplace">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  Browse marketplace
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newInMarketplace.map((event) => (
                <EventCard key={event.id} event={event} href={`/events/${event.slug}`} showApplyButton />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">Activity</h3>
            </div>

            <div className="space-y-4">
              {activity.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between gap-4 pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{entry.description}</div>
                    <div className="text-xs text-offwhite/40">{entry.date}</div>
                  </div>
                  <div className={`text-sm font-semibold ${entry.amount >= 0 ? 'text-accent-green' : 'text-offwhite/70'}`}>
                    {entry.amount >= 0 ? formatCurrency(entry.amount) : `-${formatCurrency(Math.abs(entry.amount))}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-6">
            <h3 className="text-lg font-bold text-white mb-2">Creator profile</h3>
            <p className="text-sm text-offwhite/40 mb-6">Optimise your profile to unlock higher commissions.</p>
            <div className="space-y-3">
              <Button variant="premium" className="w-full" asChild>
                <Link href="/app/profile">Update profile</Link>
              </Button>
              <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5" asChild>
                <Link href="/app/builder">Open link builder</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
