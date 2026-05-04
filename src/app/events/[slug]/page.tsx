'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/data/mock';
import { Calendar, MapPin, Ticket, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function EventDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

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

  const avgTicketPrice = useMemo(() => {
    if (!event || event.ticketTiers.length === 0) return 0;
    const total = event.ticketTiers.reduce((sum, tier) => sum + tier.price, 0);
    return Math.round(total / event.ticketTiers.length);
  }, [event]);

  const estimatedPerSale = useMemo(() => {
    if (!event) return 0;
    return Math.max(event.commissionFixed, Math.round(avgTicketPrice * (event.commission / 100)));
  }, [event, avgTicketPrice]);

  if (notFound) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl">Event not found</div>;
  }
  if (!event) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl">Loading event...</div>;
  }

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      <main className="pb-20">
        <section className="relative min-h-[500px] border-b border-white/10">
          <Image src={event.image} alt={event.title} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 premium-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/65 to-black/25" />
          <div className="page-shell relative z-10 pt-24 pb-14 md:pt-32 md:pb-20">
            <Badge variant="premium" className="mb-5 bg-primary text-white border-primary/20">
              {event.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight">{event.title}</h1>
            <div className="mt-5 flex flex-wrap gap-5 text-offwhite/85">
              <div className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{event.date}</div>
              <div className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.city} · {event.venue}</div>
              <div className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Promoter: {event.promoter}</div>
            </div>
          </div>
        </section>

        <div className="page-shell mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Section title="Campaign overview">
              <p className="text-offwhite/70 leading-relaxed">{event.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Meta label="Ticket price range" value={event.ticketTiers.length > 1 ? `${formatCurrency(event.ticketTiers[0].price)} - ${formatCurrency(event.ticketTiers[event.ticketTiers.length - 1].price)}` : formatCurrency(event.ticketTiers[0]?.price ?? 0)} />
                <Meta label="Commission rate" value={`${event.commission}%`} />
                <Meta label="Estimated earning per sale" value={formatCurrency(estimatedPerSale)} />
                <Meta label="Refund window" value="7 to 14 days post-event" />
              </div>
            </Section>

            <Section title="Why promote this event">
              <ul className="space-y-3 text-offwhite/70">
                <li className="flex gap-2"><Sparkles className="w-4 h-4 text-primary mt-1" />High-intent audience actively buying ticketed experiences.</li>
                <li className="flex gap-2"><Sparkles className="w-4 h-4 text-primary mt-1" />Strong creative assets provided for stories, reels, and TikToks.</li>
                <li className="flex gap-2"><Sparkles className="w-4 h-4 text-primary mt-1" />Clear payout policy after refund window settlement.</li>
              </ul>
            </Section>

            <Section title="Creator brief">
              <p className="text-offwhite/70 leading-relaxed">
                Share an authentic event recommendation, include your code and campaign link, and explain why your audience should attend.
                Include event date and city in the first frame or caption.
              </p>
              <div className="mt-4 text-sm text-offwhite/60">Creator requirements: event-fit content, local audience relevance, and brand-safe presentation.</div>
            </Section>

            <Section title="Assets included">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-offwhite/70">
                <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Story templates (9:16)</li>
                <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">TikTok/Reel cover art</li>
                <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Caption hooks and CTA copy</li>
                <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Event key visual and logos</li>
              </ul>
              <p className="text-sm text-offwhite/55 mt-4">Example discount code: <span className="text-white font-semibold">MAYA10</span></p>
            </Section>

            <Section title="Payout and refund window">
              <p className="text-offwhite/70 leading-relaxed">
                Payouts settle after the promoter&apos;s refund window closes, typically 7 to 14 days post-event.
                Refunded tickets are excluded from final commission to keep attribution fair.
              </p>
            </Section>
          </div>

          <aside>
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Apply to promote</h3>
              <div className="space-y-3 mb-6 text-sm text-offwhite/70">
                <div className="flex items-center gap-2"><Ticket className="w-4 h-4 text-primary" />Average ticket price: {formatCurrency(avgTicketPrice)}</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" />Commission: {event.commission}% ({formatCurrency(estimatedPerSale)} est.)</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Event date: {event.date}</div>
              </div>
              <Button variant="premium" className="w-full h-12 mb-3" asChild>
                <Link href={`/apply/creator?event=${event.slug}`}>Apply to Promote</Link>
              </Button>
              <Button variant="outline" className="w-full h-11 text-white border-white/20 hover:bg-white/10" asChild>
                <Link href="/events">Back to Marketplace</Link>
              </Button>
              <p className="text-xs text-offwhite/55 mt-4">Apply flow goes to creator application first.</p>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-dark/35 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-offwhite/40 mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
