'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EventCard } from '@/components/shared/EventCard';
import { PromoterBrandMarquee } from '@/components/marketing/PromoterBrandMarquee';
import { CategoryDiscoverStrip } from '@/components/marketing/CategoryDiscoverStrip';
import { creators, events } from '@/data/mock';
import { ArrowRight, Music, Users, BarChart3, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const heroImages = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2070&q=80',
];

export default function Home() {
  const featuredEvents = events.slice(0, 6);
  const featuredCreators = creators.slice(0, 4);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <section className="relative h-screen min-h-[760px] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div key={heroImages[heroIndex]} className="absolute inset-0 z-0 transition-opacity duration-[1400ms] opacity-100">
          <Image
            src={heroImages[heroIndex]}
            alt="Stagepass event hero"
            fill
            sizes="100vw"
            className="object-cover hero-zoom blur-[1.5px]"
            priority
          />
        </div>
        <div className="absolute inset-0 premium-hero-overlay" />
        <div className="absolute inset-0 premium-vignette" />
        <div className="absolute inset-0 light-particles" />

        <div className="page-shell relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-7 rounded-full bg-black/55 border border-white/20 text-white/90 font-semibold text-xs uppercase tracking-[0.2em]">
            Experience commerce
          </div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[clamp(4rem,9vw,7.5rem)] font-bold text-white mb-8 tracking-[0.02em] leading-[0.95] text-balance uppercase">
            The future of selling <span className="text-primary">experiences.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed text-balance font-medium">
            Events, festivals, nightlife, and wellness campaigns for creators who move real ticket sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply/creator">
              <Button variant="premium" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                Apply as Creator
              </Button>
            </Link>
            <Link href="/contact?intent=demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                List Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/45 overflow-hidden">
        <div className="page-shell pt-10 md:pt-12 pb-4">
          <p className="text-center text-offwhite/40 text-sm font-semibold uppercase tracking-[0.22em]">
            Trusted by Australia&apos;s Leading Promoters
          </p>
        </div>
        <PromoterBrandMarquee />
      </section>

      <CategoryDiscoverStrip />

      <div className="section-stack">
        <section className="app-section bg-dark">
          <div className="page-shell">
            <div className="flex justify-between items-end mb-14">
              <div>
                <h2 className="text-5xl font-extrabold text-white mb-4">Featured Events</h2>
                <p className="text-[#aaaaaa] text-lg leading-relaxed">High-converting campaigns ready to launch today.</p>
              </div>
              <Link href="/events">
                <Button variant="ghost" className="text-primary hover:text-primary/80 flex items-center gap-2 group">
                  Explore all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} showApplyButton />
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="app-section bg-offwhite text-dark">
          <div className="page-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-dark/50 mb-5">Why creators use Stagepass</h3>
                <div className="space-y-7">
                  {[
                    {
                      title: 'One payout, every promoter',
                      body: 'You promote ten events from ten promoters and get one weekly payment from Stagepass. No chasing invoices or ten different bank transfers.',
                    },
                    {
                      title: 'Curated supply, not a free-for-all',
                      body: 'Every campaign is vetted by Stagepass. No dropshipping junk, no scammy events. Built for creators who care what they put their name to.',
                    },
                    {
                      title: 'Built for live events, not generic affiliate',
                      body: 'Discount codes that work on ticketing platforms, asset packs sized for stories and TikToks, and attribution that handles refund windows fairly.',
                    },
                  ].map((item, idx) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                      <div>
                        <p className="text-xl font-bold text-dark/90">{item.title}</p>
                        <p className="text-base font-medium text-dark/75 leading-relaxed mt-1">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-dark/50 mb-5">What creators can publish</h3>
                <div className="space-y-6">
                  <FeatureLine title="Ticketed event promotions" desc="Promote upcoming events that match your city, category, and audience." icon={<Music className="w-5 h-5" />} />
                  <FeatureLine title="Events I'm Attending" desc="Creator profile pages can highlight events you are attending, with direct conversion links." icon={<Users className="w-5 h-5" />} />
                  <FeatureLine title="Video-first campaign assets" desc="Post reels, stories, and TikToks with event-ready packs and trackable attribution." icon={<BarChart3 className="w-5 h-5" />} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <EarningsCalculator />

        <QuickApplyBar />

        <section className="app-section pt-8 md:pt-10 lg:pt-12 pb-10 md:pb-12 lg:pb-14 bg-dark border-t border-white/10">
          <div className="page-shell">
            <div className="flex items-end justify-between mb-12 gap-5">
              <div>
                <h2 className="text-5xl font-extrabold text-white mb-3">Featured Creators</h2>
                <p className="text-[#aaaaaa] text-lg leading-relaxed">Editorial voices that move real ticket demand.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {featuredCreators.map((creator) => (
                <div key={creator.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover-lift">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 mb-4">
                    <Image src={creator.avatar} alt={creator.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="text-white font-extrabold text-lg">{creator.name}</div>
                  <div className="text-sm text-offwhite/50">{creator.niche}</div>
                  <div className="mt-3 text-primary text-sm font-semibold">{creator.audienceSize} audience</div>
                  <div className="mt-1 text-xs text-offwhite/45 leading-relaxed">
                    {creator.name.split(' ')[0]} earned ${Math.round(creator.fitScore * 43).toLocaleString()} promoting featured events.
                  </div>
                  <Link
                    href={`/creators/${creator.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View creator page
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="app-section pt-10 md:pt-12 lg:pt-14 bg-dark">
          <div className="page-shell max-w-3xl">
            <h2 className="text-5xl font-extrabold text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem
                question="How and when do I get paid?"
                answer="Creators receive one weekly payout from Stagepass across all approved promoter campaigns. Payouts settle after the promoter's refund window closes, typically 7 to 14 days after the event."
              />
              <FAQItem
                question="Do I need a minimum follower count?"
                answer="There is no fixed minimum. Stagepass reviews creators based on audience fit, location, content quality, and whether their audience matches active campaigns."
              />
              <FAQItem
                question="What happens if my audience buys and then refunds?"
                answer="Refunded tickets are excluded from final commission. Stagepass uses the promoter's refund window so creators are not unfairly clawed back after settlement."
              />
              <FAQItem
                question="Can I be rejected from a campaign even if I am approved as a creator?"
                answer="Yes. Some campaigns have limited spots or specific audience, city, or category requirements. You can still apply for other campaigns in the marketplace."
              />
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </div>
  );
}

function FeatureLine({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dark/10 bg-white p-6 flex gap-4 hover-lift">
      <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <h4 className="text-xl font-bold text-dark">{title}</h4>
        <p className="text-dark/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function EarningsCalculator() {
  const [tickets, setTickets] = useState(50);
  const [price, setPrice] = useState(150);
  const [commission, setCommission] = useState(12);
  const [mode, setMode] = useState<'single' | 'monthly'>('single');
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);

  const baseEarnings = useMemo(() => tickets * price * (commission / 100), [tickets, price, commission]);
  const earnings = mode === 'single' ? baseEarnings : baseEarnings * campaignsPerMonth;

  return (
    <section id="pricing" className="app-section py-12 md:py-14 lg:py-16 overflow-hidden relative">
      <div className="absolute inset-0 premium-gradient opacity-95" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="page-shell relative z-10">
        <div className="max-w-5xl mx-auto bg-dark rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-extrabold mb-6 leading-tight">How the money works.</h2>
              <p className="text-[#bcbccb] mb-10 text-lg leading-relaxed">
                Most creators in our beta earn $400 to $2,800 per campaign depending on audience size and category.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-8">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'single' ? 'bg-primary text-white' : 'bg-white/10 text-white/75'}`}
                >
                  Single campaign
                </button>
                <button
                  type="button"
                  onClick={() => setMode('monthly')}
                  className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'monthly' ? 'bg-primary text-white' : 'bg-white/10 text-white/75'}`}
                >
                  Monthly across multiple campaigns
                </button>
              </div>

              <RangeInput label="Tickets Sold" value={tickets} setValue={setTickets} min={1} max={500} suffix="" />
              <RangeInput label="Average Ticket Price" value={price} setValue={setPrice} min={20} max={1000} suffix="$" />
              <RangeInput label="Commission" value={commission} setValue={setCommission} min={5} max={25} suffix="%" />
              {mode === 'monthly' && (
                <RangeInput
                  label="Campaigns per month"
                  value={campaignsPerMonth}
                  setValue={setCampaignsPerMonth}
                  min={1}
                  max={12}
                  suffix=""
                />
              )}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center flex flex-col justify-center">
              <span className="text-sm uppercase tracking-widest font-bold text-offwhite/60 mb-2">
                {mode === 'single' ? 'Projected campaign earnings' : 'Projected monthly earnings'}
              </span>
              <div className="text-6xl md:text-8xl font-black text-white mb-6">
                ${earnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-offwhite/40 text-sm">
                Payouts settle after the promoter refund window closes, typically 7 to 14 days post-event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickApplyBar() {
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Events');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const normalizedHandle = handle.trim();
    const normalizedCity = city.trim();
    if (!normalizedHandle || !normalizedCity || !category.trim()) {
      setSubmitError('Please fill all fields before continuing.');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/public/creator-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          handle: normalizedHandle,
          city: normalizedCity,
          category: category.trim(),
        }),
      });
    } catch {
      // Non-blocking capture: route to full application even if lead save fails.
    } finally {
      setSubmitting(false);
    }

    const params = new URLSearchParams({
      handle: normalizedHandle,
      city: normalizedCity,
      category: category.trim(),
    });
    window.location.href = `/apply/creator?${params.toString()}`;
  }

  return (
    <section className="app-section py-8 md:py-10 bg-dark border-t border-white/10 border-b border-white/10">
      <div className="page-shell">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Start your creator application</h2>
        <p className="text-offwhite/60 mb-6">
          Share three details first, then continue to the full application with fields pre-filled.
        </p>
        <form onSubmit={submitLead} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Instagram or TikTok handle"
            className="h-12 rounded-xl bg-white/5 border border-white/15 px-4 text-white placeholder:text-offwhite/45 focus:outline-none focus:border-primary"
          />
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Primary city"
            className="h-12 rounded-xl bg-white/5 border border-white/15 px-4 text-white placeholder:text-offwhite/45 focus:outline-none focus:border-primary"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl bg-white/5 border border-white/15 px-4 text-white focus:outline-none focus:border-primary"
          >
            <option value="Events" className="bg-white text-black">Events</option>
            <option value="Festivals" className="bg-white text-black">Festivals</option>
            <option value="Nightlife" className="bg-white text-black">Nightlife</option>
            <option value="Wellness" className="bg-white text-black">Wellness</option>
          </select>
          <Button type="submit" variant="premium" className="h-12 w-full">
            {submitting ? 'Continuing...' : 'Continue application'}
          </Button>
        </form>
        {submitError ? <p className="text-sm text-red-400 mt-3">{submitError}</p> : null}
      </div>
    </section>
  );
}

function RangeInput({ label, value, setValue, min, max, suffix }: { label: string; value: number; setValue: (value: number) => void; min: number; max: number; suffix: string }) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
        <span>{label}</span>
        <span className="text-primary">{suffix === '$' ? '$' : ''}{value}{suffix === '%' ? '%' : ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex items-center justify-between text-left group">
        <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-offwhite/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="px-6 pb-6 text-offwhite/60 leading-relaxed">{answer}</div>}
    </div>
  );
}
