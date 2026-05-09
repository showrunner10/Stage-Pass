import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/MetricCard';
import { DollarSign, Ticket, Users, Eye, Settings } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminEventDetail } from '@/lib/server/admin-events';
import { formatCurrency } from '@/lib/utils';

type EventDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventDetailPage({ params }: EventDetailProps) {
  const resolvedParams = await params;
  const event = await getAdminEventDetail(resolvedParams.id);

  if (!event) {
    notFound();
  }

  const totalCommission = event.creators.reduce((sum, creator) => sum + creator.commission, 0);
  const totalClicks = event.creators.reduce((sum, creator) => sum + creator.clicks, 0);

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-10">
          <Link href="/admin/events" className="text-primary hover:text-primary/80 flex items-center gap-2 mb-6">
            ← Back to Events
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{event.title}</h1>
              <p className="text-[#aaaaaa]">
                {event.date} • {event.venue}, {event.city}
              </p>
            </div>
            <Link href={`/admin/events/new?edit=${encodeURIComponent(event.id)}`}>
              <Button variant="outline" className="h-12 text-white border-white/30 hover:bg-white/10 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Edit Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <MetricCard title="Total Sales" value={event.soldCount.toLocaleString()} description="tickets sold" icon={<Ticket className="w-5 h-5" />} />
          <MetricCard
            title="Commission Paid"
            value={formatCurrency(totalCommission)}
            description="creator payouts"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Active Creators"
            value={event.creators.filter((creator) => creator.status === 'Approved').length}
            description="promoting your event"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard title="Tracked Clicks" value={totalClicks.toLocaleString()} description="campaign visits" icon={<Eye className="w-5 h-5" />} />
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#aaaaaa] text-sm mb-2">Description</p>
                <p className="text-white leading-relaxed">{event.description}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-2">Commission Rate</p>
                  <p className="text-white font-semibold">{event.commission}% per ticket</p>
                </div>
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-2">Capacity</p>
                  <p className="text-white font-semibold">{event.capacity.toLocaleString()} tickets</p>
                </div>
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-2">Tracked Sales</p>
                  <p className="text-white font-semibold">{event.soldCount.toLocaleString()} sold</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Ticket Inventory</h2>
            <div className="space-y-8">
              {event.tiers.map((tier) => {
                const available = Math.max(tier.total - tier.sold - tier.reserved, 0);
                const fillPercentage = tier.total === 0 ? 0 : (tier.sold / tier.total) * 100;

                return (
                  <div key={tier.tier}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-bold">{tier.tier}</h3>
                      <span className="text-[#aaaaaa] text-sm">
                        {tier.sold} sold • {tier.reserved} reserved • {available} available
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${fillPercentage}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-[#aaaaaa]">
                      <span>{tier.total} total</span>
                      <span>{fillPercentage.toFixed(0)}% sold</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Creator Partnerships</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Creator</th>
                    <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Audience</th>
                    <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Status</th>
                    <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Sales</th>
                    <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Clicks</th>
                    <th className="text-right py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {event.creators.map((creator) => (
                    <tr key={creator.name} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white font-semibold">{creator.name}</td>
                      <td className="py-4 px-4 text-[#aaaaaa]">{creator.followers}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            creator.status === 'Approved'
                              ? 'bg-green-900/30 text-green-400'
                              : creator.status === 'Paused'
                                ? 'bg-zinc-800 text-zinc-300'
                                : 'bg-yellow-900/30 text-yellow-400'
                          }`}
                        >
                          {creator.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">{creator.sales}</td>
                      <td className="py-4 px-4 text-white font-semibold">{creator.clicks.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-primary font-bold">{formatCurrency(creator.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
