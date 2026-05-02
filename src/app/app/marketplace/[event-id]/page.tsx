'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { events } from '@/data/mock';
import { ArrowRight, Clock, MapPin, Users, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface EventDetailProps {
  params: {
    'event-id': string;
  };
}

export default function EventDetailPage({ params }: EventDetailProps) {
  const event = events.find((e) => e.id.toString() === params['event-id']);

  if (!event) {
    notFound();
  }

  const briefingItems = [
    {
      title: 'Event Overview',
      content: event.description,
    },
    {
      title: 'Target Audience',
      content: event.audienceType === 'Gen Z' ? '18-24 year olds interested in nightlife and culture' : 'Adults interested in premium experiences',
    },
    {
      title: 'Commission Rate',
      content: `${event.commission}% of each ticket sold`,
    },
    {
      title: 'Inventory',
      content: `${event.inventory} tickets available`,
    },
  ];

  return (
    <DashboardShell>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <Link href="/app/marketplace" className="text-primary hover:text-primary/80 flex items-center gap-2 mb-6">
            ← Back to Marketplace
          </Link>
        </div>

        {/* Event Card */}
        <Card className="mb-10 overflow-hidden bg-white/5 border-white/10">
          <div className="relative h-64 w-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
            <span className="text-6xl">{event.emoji}</span>
          </div>
          <div className="p-8 md:p-12">
            <h1 className="text-5xl font-black text-white mb-4">{event.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 py-8 border-t border-b border-white/10">
              <div>
                <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-2">Date</p>
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" /> {event.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-2">Location</p>
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> {event.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-2">Commission</p>
                <p className="text-xl font-semibold text-primary">{event.commission}%</p>
              </div>
              <div>
                <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-2">Available Spots</p>
                <p className="text-xl font-semibold text-white">{event.inventory}</p>
              </div>
            </div>

            <p className="text-lg text-[#aaaaaa] leading-relaxed mb-10">{event.description}</p>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-2xl border border-primary/30 mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Promote?</h3>
              <p className="text-[#aaaaaa] mb-6">
                Create a campaign to get tracked links and white-label pages. Earn {event.commission}% commission on every ticket sold.
              </p>
              <Link href={`/app/builder?event=${event.id}`}>
                <Button variant="premium" className="h-12 px-8">
                  Create Campaign <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Event Brief */}
        <div className="space-y-6 mb-10">
          <h2 className="text-3xl font-black text-white">Event Brief</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {briefingItems.map((item) => (
              <Card key={item.title} className="p-6 bg-white/5 border-white/10">
                <h3 className="text-white font-bold mb-3">{item.title}</h3>
                <p className="text-[#aaaaaa] leading-relaxed">{item.content}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Promotion Tips */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 mb-10">
          <h2 className="text-3xl font-black text-white mb-8">Tips for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Understand Your Audience',
                desc: `${event.name} appeals to ${event.audienceType} audiences. Tailor your promotion to match their interests.`,
                icon: <Users className="w-6 h-6" />,
              },
              {
                title: 'Use Multiple Channels',
                desc: 'Share your trackable link across stories, posts, TikTok, and community channels. Test what resonates.',
                icon: <Zap className="w-6 h-6" />,
              },
              {
                title: 'Highlight the Value',
                desc: 'Be specific about why this event matters. What experience does it deliver? Why should they buy now?',
                icon: <TrendingUp className="w-6 h-6" />,
              },
              {
                title: 'Early Bird Advantage',
                desc: 'Early promotions get higher visibility. Start within 24 hours of campaign launch for best results.',
                icon: <Zap className="w-6 h-6" />,
              },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-4">
                <div className="text-primary shrink-0">{tip.icon}</div>
                <div>
                  <h3 className="text-white font-bold mb-2">{tip.title}</h3>
                  <p className="text-[#aaaaaa] leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href={`/app/builder?event=${event.id}`}>
            <Button variant="premium" size="lg" className="h-14 px-10 text-lg">
              Create Campaign & Start Earning
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
