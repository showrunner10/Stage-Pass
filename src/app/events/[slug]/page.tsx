'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import type { Event } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Ticket, Users, ShieldCheck, Share2, TrendingUp, Download, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch(`/api/public/events/${encodeURIComponent(slug)}`, { cache: 'no-store' });
      if (!active) return;
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) return;
      const json = (await res.json()) as Event;
      setEvent(json);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (notFound) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl">Event not found</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl">Loading event...</div>;
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

              <section>
                <h2 className="text-2xl font-bold text-white mb-5">Brand Assets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <Image 
                      src={event.image} 
                      alt="Event banner" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold mb-3">Included in Asset Pack:</h3>
                      <ul className="space-y-2 text-offwhite/60 text-sm">
                        <li>✓ Event banner (1200x630px)</li>
                        <li>✓ Square logo (500x500px)</li>
                        <li>✓ Social media templates</li>
                        <li>✓ Pre-written copy & CTAs</li>
                        <li>✓ Brand guidelines</li>
                      </ul>
                    </div>
                    <a href={event.assetPackUrl ?? `/assets/packs/${event.slug}-asset-pack.txt`} download className="mt-4">
                      <Button variant="outline" className="w-full h-11 text-white border-white/10 hover:bg-white/5 font-bold text-sm">
                        <Download className="w-4 h-4 mr-2" /> Download All Assets
                      </Button>
                    </a>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent p-7">
                <div className="flex items-center gap-3 mb-5">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-white">Performance Benchmarks</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                  <div className="rounded-xl border border-white/10 bg-dark/30 p-4">
                    <div className="text-xs text-offwhite/40 uppercase tracking-widest mb-2">Avg. Conversion Rate</div>
                    <div className="text-2xl font-black text-primary">4.2%</div>
                    <div className="text-xs text-offwhite/60 mt-1">across similar events</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-dark/30 p-4">
                    <div className="text-xs text-offwhite/40 uppercase tracking-widest mb-2">Avg. Clicks per Creator</div>
                    <div className="text-2xl font-black text-primary">1,248</div>
                    <div className="text-xs text-offwhite/60 mt-1">in first 2 weeks</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-dark/30 p-4">
                    <div className="text-xs text-offwhite/40 uppercase tracking-widest mb-2">Avg. Earnings</div>
                    <div className="text-2xl font-black text-primary">$420</div>
                    <div className="text-xs text-offwhite/60 mt-1">per top creator</div>
                  </div>
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
              {!isLoggedIn && (
                <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 p-7">
                  <div className="flex items-start gap-3 mb-4">
                    <LogIn className="w-6 h-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-white font-bold mb-2">Sign in to Promote</h3>
                      <p className="text-offwhite/60 text-sm mb-5">Create a free account to start earning commission on event promotions.</p>
                      <div className="space-y-2">
                        <Link href={`/login?next=/events/${slug}`}>
                          <Button variant="primary" className="w-full h-11 text-base font-bold">
                            Sign In
                          </Button>
                        </Link>
                        <Link href={`/signup?mode=signup&next=/events/${slug}`}>
                          <Button variant="outline" className="w-full h-11 text-white border-white/30 hover:bg-white/5 font-bold">
                            Create Account
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  {isLoggedIn ? (
                    <>
                      <Link href={`/app/builder?event=${event.id}`}>
                        <Button variant="premium" className="w-full h-12 text-base font-bold">
                          Promote This Event
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full h-12 text-white border-white/10 hover:bg-white/5 font-bold">
                        <Share2 className="w-4 h-4 mr-2" /> Buy Tickets
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href={`/login?next=/events/${slug}`}>
                        <Button variant="premium" className="w-full h-12 text-base font-bold">
                          Sign In to Promote
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full h-12 text-white border-white/10 hover:bg-white/5 font-bold">
                        <Share2 className="w-4 h-4 mr-2" /> Buy Tickets
                      </Button>
                    </>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="text-xs text-offwhite/45 uppercase tracking-widest mb-1">Promoter</div>
                  <div className="text-white font-semibold">{event.promoter}</div>
                  <div className="text-xs text-offwhite/45 mt-3">Assets sourced from promoter brand kits and approved stock placeholders.</div>
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
