'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/shared/MetricCard';
import { EventCard } from '@/components/shared/EventCard';
import { campaigns, events, ledgerEntries } from '@/data/mock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, DollarSign, Ticket, TrendingUp, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { CampaignStatusBadge } from '@/components/shared/CampaignStatusBadge';
import { Button } from '@/components/ui/button';

export default function CreatorDashboard() {
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 4);

  const newInMarketplace = events.slice(0, 3);

  const ticketsSold30d = campaigns.reduce((sum, c) => sum + c.ticketsSold, 0);
  const commissionEarned = campaigns.reduce((sum, c) => sum + c.commission, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'Live').length;
  const conversionRate =
    campaigns.length === 0
      ? 0
      : campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length;

  const activity = ledgerEntries.slice(0, 6);

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
              description="Clearing in 2–7 days"
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
                {topCampaigns.map((c) => {
                  const event = events.find((e) => e.id === c.eventId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{c.name}</span>
                          <span className="text-xs text-offwhite/40">{event?.title ?? 'Event'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CampaignStatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-right">{c.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{c.ticketsSold}</TableCell>
                      <TableCell className="text-right">{c.conversionRate.toFixed(1)}%</TableCell>
                      <TableCell className="text-right text-accent-green font-semibold">
                        {formatCurrency(c.commission)}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              {activity.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-4 pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{a.description}</div>
                    <div className="text-xs text-offwhite/40">{a.date}</div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      a.amount >= 0 ? 'text-accent-green' : 'text-offwhite/70'
                    }`}
                  >
                    {a.amount >= 0 ? formatCurrency(a.amount) : `-${formatCurrency(Math.abs(a.amount))}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-6">
            <h3 className="text-lg font-bold text-white mb-2">Creator profile</h3>
            <p className="text-sm text-offwhite/40 mb-6">Optimise your profile to unlock higher commissions.</p>
            <div className="space-y-3">
              <Link href="/app/profile">
                <Button variant="premium" className="w-full">
                  Update profile
                </Button>
              </Link>
              <Link href="/app/builder">
                <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5">
                  Open link builder
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
