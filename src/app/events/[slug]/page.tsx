'use client';

import { useParams } from 'next/navigation';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { events } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Ticket, Users, ShieldCheck, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <main className="pb-24">
        <div className="relative h-[66vh] min-h-[520px] w-full">
          <Image src={event.image} alt={event.title} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 premium-hero-overlay" />

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="page-shell">
              <div className="max-w-3xl">
                <Badge variant="premium" className="mb-6 bg-primary text-white border-none px-4 py-1.5 text-base font-bold">
                  {event.commission}% · {formatCurrency(event.commissionFixed)} per sale
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">{event.title}</h1>
                <div className="flex flex-wrap gap-6 text-offwhite/85 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {event.venue}, {event.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-shell mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-white mb-5">Event Overview</h2>
                <p className="text-offwhite/65 text-lg leading-relaxed whitespace-pre-line">{event.description}</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-5">Ticket Tiers</h2>
                <div className="space-y-4">
                  {event.ticketTiers.map((tier) => (
                    <div key={tier.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-primary/35 transition-colors">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                          <p className="text-offwhite/50 text-sm mt-2">{tier.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">{formatCurrency(tier.price)}</div>
                          <div className="text-xs font-semibold uppercase tracking-widest text-accent-green mt-1">
                            Commission: {formatCurrency(tier.price * (event.commission / 100))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="flex items-center gap-3 mb-5">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-white">Audience Fit</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                  <Meta title="Category" value={event.category} />
                  <Meta title="Age Bracket" value="21-35" />
                  <Meta title="Top Interests" value="Music, Nightlife, Culture" />
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sticky top-28">
                <div className="mb-8">
                  <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest mb-2">Commission Rate</div>
                  <div className="text-5xl font-black text-primary mb-1">{event.commission}%</div>
                  <div className="text-offwhite/60">per ticket sold</div>
                </div>

                <div className="space-y-4 mb-8">
                  <InfoLine icon={<ShieldCheck className="w-5 h-5 text-accent-green" />} text="Verified promoter" />
                  <InfoLine icon={<Clock className="w-5 h-5 text-primary" />} text="Fast creator approval" />
                  <InfoLine icon={<Ticket className="w-5 h-5 text-primary" />} text="Assets and copy included" />
                </div>

                <div className="space-y-3">
                  <Link href="/app/dashboard">
                    <Button variant="premium" className="w-full h-12 text-base font-bold">
                      Promote This Event
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-12 text-white border-white/10 hover:bg-white/5 font-bold">
                    <Share2 className="w-4 h-4 mr-2" /> Buy Tickets
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="text-xs text-offwhite/45 uppercase tracking-widest mb-1">Promoter</div>
                  <div className="text-white font-semibold">{event.promoter}</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function Meta({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-dark/30 p-4">
      <div className="text-xs text-offwhite/40 uppercase tracking-widest mb-2">{title}</div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );
}

function InfoLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-offwhite/85">
      {icon}
      <span>{text}</span>
    </div>
  );
}
