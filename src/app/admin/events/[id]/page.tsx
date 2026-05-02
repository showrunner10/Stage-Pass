'use client';

import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/MetricCard';
import { events } from '@/data/mock';
import { TrendingUp, DollarSign, Ticket, Users, Eye, Settings } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface EventDetailProps {
  params: {
    id: string;
  };
}

export default function AdminEventDetailPage({ params }: EventDetailProps) {
  const event = events.find((e) => e.id.toString() === params.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'creators' | 'performance'>('overview');

  if (!event) {
    notFound();
  }

  const mockCreators = [
    { name: 'Sarah Media', followers: '125K', status: 'Approved', sales: 342, commission: '$1,368' },
    { name: 'Alex Chen', followers: '89K', status: 'Approved', sales: 218, commission: '$872' },
    { name: 'Jordan Beats', followers: '156K', status: 'Pending', sales: 0, commission: '$0' },
  ];

  return (
    <AdminShell>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <Link href="/admin/events" className="text-primary hover:text-primary/80 flex items-center gap-2 mb-6">
            ← Back to Events
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{event.name}</h1>
              <p className="text-[#aaaaaa]">
                {event.date} • {event.location}
              </p>
            </div>
            <Link href={`/admin/events/${event.id}/edit`}>
              <Button variant="outline" className="h-12 text-white border-white/30 hover:bg-white/10 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Edit Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <MetricCard title="Total Sales" value="560" description="tickets sold" icon={<Ticket className="w-5 h-5" />} />
          <MetricCard
            title="Commission Paid"
            value="$2,240"
            description="total creator payouts"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Active Creators"
            value={mockCreators.filter((c) => c.status === 'Approved').length}
            description="promoting your event"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard title="Engagement" value="28.4K" description="page views" icon={<Eye className="w-5 h-5" />} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {['overview', 'inventory', 'creators', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-semibold capitalize transition-colors border-b-2 ${
                activeTab === tab ? 'text-primary border-primary' : 'text-[#aaaaaa] border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Event Details */}
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-2">Description</p>
                  <p className="text-white leading-relaxed">{event.description}</p>
                </div>
                <div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[#aaaaaa] text-sm mb-2">Audience Type</p>
                      <p className="text-white font-semibold">{event.audienceType}</p>
                    </div>
                    <div>
                      <p className="text-[#aaaaaa] text-sm mb-2">Commission Rate</p>
                      <p className="text-white font-semibold">{event.commission}% per ticket</p>
                    </div>
                    <div>
                      <p className="text-[#aaaaaa] text-sm mb-2">Ticket Price</p>
                      <p className="text-white font-semibold">$75 - $150</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Commission Structure */}
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Commission Breakdown</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white font-semibold">Base Commission (All Creators)</span>
                  <span className="text-primary font-bold text-lg">{event.commission}%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white font-semibold">Bonus (500+ followers)</span>
                  <span className="text-primary font-bold text-lg">+2%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white font-semibold">Volume Bonus (50+ sales)</span>
                  <span className="text-primary font-bold text-lg">+3%</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Ticket Inventory</h2>
              <div className="space-y-8">
                {[
                  { tier: 'General Admission', total: 500, sold: 342, reserved: 50 },
                  { tier: 'VIP', total: 100, sold: 73, reserved: 10 },
                  { tier: 'Group (10+)', total: 50, sold: 21, reserved: 5 },
                ].map((tier) => {
                  const available = tier.total - tier.sold - tier.reserved;
                  const fillPercentage = (tier.sold / tier.total) * 100;

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
              <h2 className="text-2xl font-bold text-white mb-6">Inventory Management</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
                  Import from CSV
                </Button>
                <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
                  Adjust Stock Levels
                </Button>
                <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
                  View Sold Tickets
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Creators Tab */}
        {activeTab === 'creators' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Creator Partnerships</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Creator</th>
                      <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Followers</th>
                      <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Status</th>
                      <th className="text-left py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Sales</th>
                      <th className="text-right py-4 px-4 text-[#aaaaaa] font-semibold uppercase text-sm tracking-wider">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCreators.map((creator) => (
                      <tr key={creator.name} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white font-semibold">{creator.name}</td>
                        <td className="py-4 px-4 text-[#aaaaaa]">{creator.followers}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              creator.status === 'Approved'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-yellow-900/30 text-yellow-400'
                            }`}
                          >
                            {creator.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-semibold">{creator.sales}</td>
                        <td className="py-4 px-4 text-right text-primary font-bold">{creator.commission}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Pending Approvals</h2>
              <div className="space-y-4">
                <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold mb-1">Jordan Beats</p>
                    <p className="text-[#aaaaaa] text-sm">156K followers • Requested 2 days ago</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-6 text-white border-white/30 hover:bg-white/10">
                      Decline
                    </Button>
                    <Button variant="primary" className="h-10 px-6">
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-3">Total Reach</p>
                  <p className="text-4xl font-black text-white">89.3K</p>
                  <p className="text-green-400 text-sm mt-2">↑ 12% from last week</p>
                </div>
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-3">Conversion Rate</p>
                  <p className="text-4xl font-black text-white">6.3%</p>
                  <p className="text-green-400 text-sm mt-2">↑ 0.8% from last week</p>
                </div>
                <div>
                  <p className="text-[#aaaaaa] text-sm mb-3">Avg. Cost Per Sale</p>
                  <p className="text-4xl font-black text-white">$8.50</p>
                  <p className="text-green-400 text-sm mt-2">↓ $2.10 from last week</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Top Performing Creators</h2>
              <div className="space-y-6">
                {[
                  { name: 'Sarah Media', sales: 342, revenue: '$25,650' },
                  { name: 'Alex Chen', sales: 218, revenue: '$16,350' },
                  { name: 'Maya Studios', sales: 156, revenue: '$11,700' },
                ].map((creator, idx) => (
                  <div key={creator.name} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{creator.name}</p>
                      <p className="text-[#aaaaaa] text-sm">{creator.sales} tickets</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">{creator.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
