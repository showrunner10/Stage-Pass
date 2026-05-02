'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EventCard } from '@/components/shared/EventCard';
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
          <div className="inline-block px-4 py-1.5 mb-7 rounded-full bg-black/45 border border-white/30 text-white/90 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.9)] font-semibold text-sm tracking-wide">
            Creator-first Event Marketplace
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[112px] font-black text-white mb-8 tracking-[-0.03em] leading-[0.9] text-balance">
            Own the <span className="text-primary">moment.</span>
            <br />
            Sell the <span className="text-primary">experience.</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#aaaaaa] mb-12 max-w-3xl mx-auto leading-relaxed text-balance">
            Stagepass blends premium event discovery with creator-driven commerce for festivals, nightlife, and culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply/creator">
              <Button variant="premium" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                Apply as Creator
              </Button>
            </Link>
            <Link href="/contact?intent=demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                List your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-stack">
        <section className="app-section border-y border-white/10 bg-black/45">
          <div className="page-shell">
            <p className="text-center text-offwhite/40 text-sm font-semibold uppercase tracking-[0.22em] mb-10">
              Trusted by Australia&apos;s Leading Promoters
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 opacity-60 grayscale contrast-125">
              {['SECRET SOUNDS', 'PULSE', 'VINO', 'HORIZON', 'LANEWAY'].map((name) => (
                <span key={name} className="text-3xl md:text-4xl font-black text-white/70 tracking-tight">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

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
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-dark/50 mb-5">How it works for creators</h3>
                <div className="space-y-7">
                  {[
                    "Pick events that fit your audience",
                    "Publish tracked links or white-label pages",
                    "Get paid per verified ticket sale",
                    "Track performance in real time",
                    "Scale campaigns with proven playbooks",
                  ].map((item, idx) => (
                    <div key={item} className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                      <p className="text-2xl font-semibold text-dark/85 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-dark/50 mb-5">How it works for promoters</h3>
                <div className="space-y-6">
                  <FeatureLine title="Launch an event" desc="Set commission tiers, inventory, and payout rules." icon={<Music className="w-5 h-5" />} />
                  <FeatureLine title="Approve creators" desc="Curate creators by fit score and audience type." icon={<Users className="w-5 h-5" />} />
                  <FeatureLine title="Track performance" desc="Measure clicks, conversion, and attributed revenue." icon={<BarChart3 className="w-5 h-5" />} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <EarningsCalculator />

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
                question="How do creator commissions work?"
                answer="Each event includes a fixed commission rate. Every verified ticket purchase from your tracked link or landing page is automatically attributed and paid out."
              />
              <FAQItem
                question="Can promoters control who promotes their events?"
                answer="Yes. Promoters can set creator approval flows, commission tiers, and campaign access per event."
              />
              <FAQItem
                question="Do I need a website to promote?"
                answer="No. You can start with a tracked link in seconds or launch a white-labeled mobile landing page with your editorial note."
              />
              <FAQItem
                question="When do payouts arrive?"
                answer="Payout timing follows promoter settlement. Most cleared commissions are paid out weekly through Stripe Connect."
              />
              <FAQItem
                question="Can I promote multiple events at once?"
                answer="Yes. You can run multiple campaigns in parallel, each with its own links, landing pages, and reporting."
              />
              <FAQItem
                question="Do promoters see my performance?"
                answer="Promoters see attributed clicks, sales, and conversion performance for each approved campaign."
              />
              <FAQItem
                question="Can I pause a campaign without deleting it?"
                answer="Yes. Campaigns can be paused and resumed while keeping historical attribution and earnings data."
              />
              <FAQItem
                question="What happens if an event is canceled?"
                answer="If ticket sales are reversed by the ticketing partner, related commissions are adjusted in your ledger."
              />
              <FAQItem
                question="How do approvals work for creators?"
                answer="Some events are instant-approve. Others require promoter approval based on audience fit and content niche."
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

  const earnings = useMemo(() => tickets * price * (commission / 100), [tickets, price, commission]);

  return (
    <section id="pricing" className="app-section py-12 md:py-14 lg:py-16 overflow-hidden relative">
      <div className="absolute inset-0 premium-gradient opacity-95" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="page-shell relative z-10">
        <div className="max-w-5xl mx-auto bg-dark rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-extrabold mb-6 leading-tight">Estimate your monthly commission.</h2>
              <p className="text-[#bcbccb] mb-10 text-lg leading-relaxed">
                Model your event income based on average ticket price, volume, and commission rate.
              </p>

              <RangeInput label="Tickets Sold" value={tickets} setValue={setTickets} min={1} max={500} suffix="" />
              <RangeInput label="Avg Ticket Price" value={price} setValue={setPrice} min={20} max={1000} suffix="$" />
              <RangeInput label="Commission" value={commission} setValue={setCommission} min={5} max={25} suffix="%" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center flex flex-col justify-center">
              <span className="text-sm uppercase tracking-widest font-bold text-offwhite/60 mb-2">Projected Monthly Earnings</span>
              <div className="text-6xl md:text-8xl font-black text-white mb-6">
                ${earnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-offwhite/40 text-sm">Projection only. Actual payout depends on conversion and event settlement timing.</p>
            </div>
          </div>
        </div>
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
