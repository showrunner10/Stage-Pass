'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowRight, ChevronDown, LineChart, ListChecks, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left gap-4 text-white font-semibold hover:text-primary transition-colors"
      >
        {q}
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-[#aaaaaa] leading-relaxed text-sm md:text-base">{a}</p>}
    </div>
  );
}

export default function PromotersPage() {
  const faqs = [
    {
      q: 'How is this different from a basic affiliate link?',
      a: 'Creators are vetted for audience fit, inventory caps protect your tiers, and every sale can be attributed to a creator and channel—not just a generic referral code.',
    },
    {
      q: 'Do we pay creators upfront?',
      a: 'No. You pay on attributed sales. Commission tiers and caps are configured per event.',
    },
    {
      q: 'What about refunds?',
      a: 'Pending commission is voided when refunds fall inside the agreed clearance window. See our Refunds & commissions policy.',
    },
    {
      q: 'Can we approve creators manually?',
      a: 'Yes. MVP assumes manual approval; auto-approve rules are a Phase 2 enhancement.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <section className="relative py-24 md:py-32 border-b border-white/10">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/12 via-transparent to-transparent" />
        <div className="page-shell relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Promoters</p>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-[-0.03em] leading-[1.05]">
              Vetted creator distribution—pay on performance.
            </h1>
            <p className="text-xl md:text-2xl text-[#aaaaaa] mb-10 leading-relaxed">
              List events, approve creators, enforce inventory caps, and track every sale back to a channel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact?intent=demo">
                <Button variant="premium" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                  Book a demo
                </Button>
              </Link>
              <Link href="/admin/events/new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                  List your event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10 bg-red-500/[0.04]">
        <div className="page-shell max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">The problem</h2>
          <ul className="space-y-4 text-lg text-[#aaaaaa] leading-relaxed">
            <li>Creator outreach, contracts, and follow-ups eat most of the week.</li>
            <li>Manual UTM spreadsheets and screenshots don&apos;t prove which creator drove the sale.</li>
            <li>Reconciliation with finance is slow—and creators lose trust when payouts are opaque.</li>
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">The solution</h2>
          <p className="text-lg text-[#aaaaaa] leading-relaxed mb-8">
            Stagepass is a creator marketplace built for live events: inventory-aware listings, approvals, attribution down to
            channel, and commission tiers that match how festivals actually sell.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Marketplace', desc: 'Self-serve discovery for vetted creators—no more one-off DMs for every campaign.' },
              { title: 'Attribution', desc: 'Last-click style tracking with partner parameters and dashboard truth.' },
              { title: 'Controls', desc: 'Inventory caps and tier rules so headline creators can’t blow past allocation.' },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-sm text-[#aaaaaa] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell">
          <h2 className="text-4xl font-black text-white mb-4 text-center">How it works</h2>
          <p className="text-center text-[#aaaaaa] mb-14 max-w-2xl mx-auto">Three steps from listing to attributed sales.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <ListChecks className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">1. List event</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">Tiers, commission, assets, and inventory caps in one place.</p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">2. Approve creators</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">Screen audience fit before they publish links or landing pages.</p>
            </div>
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <LineChart className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">3. Track every sale</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">Channel-level performance and exportable reconciliation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell">
          <h2 className="text-4xl font-black text-white mb-4 text-center">Case studies</h2>
          <p className="text-center text-[#aaaaaa] mb-12 max-w-2xl mx-auto">
            Launch narratives—replace with signed promoter quotes and metrics when available.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Festival · AU</p>
              <h3 className="text-2xl font-bold text-white mb-3">Camping &amp; VIP upsell</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Promoter wanted audience-fit creators for add-on inventory—not just top-of-funnel awareness. Stagepass routes
                approvals and caps per tier so creators stay inside allocation.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Nightlife · Sydney</p>
              <h3 className="text-2xl font-bold text-white mb-3">DJ-led warehouse series</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Independent promoter systematised guest-list style cuts: tracked links per resident DJ and newsletter, with
                weekly payout visibility for creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <h2 className="text-4xl font-black text-white mb-10 text-center">FAQ</h2>
          <div>
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="page-shell">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-black text-white mb-4">Talk to us</h2>
          <p className="text-lg text-[#aaaaaa] mb-10 max-w-2xl mx-auto">
            Book a demo or send a message—we’ll follow up with next steps and onboarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?intent=demo">
              <Button variant="premium" size="lg" className="h-14 px-10 text-lg inline-flex items-center gap-2 group">
                Book a demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                Contact form
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
