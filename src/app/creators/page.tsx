'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import {
  ArrowRight,
  ChevronDown,
  Link2,
  LayoutTemplate,
  ShoppingBag,
  Wallet,
  TrendingUp,
} from 'lucide-react';
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

export default function CreatorsPage() {
  const earningExamples = [
    { label: 'Weekend festival pass', ticket: '$320 AUD', rate: '15%', you: '~$48 / sale' },
    { label: 'VIP tier collab', ticket: '$580 AUD', rate: '16%', you: '~$93 / sale' },
    { label: 'Club night GA', ticket: '$65 AUD', rate: '14%', you: '~$9 / sale' },
  ];

  const faqs = [
    {
      q: 'Do I need a minimum follower count?',
      a: 'We screen for audience fit and content quality. Smaller engaged accounts can be approved for niche events; large reach unlocks headline-tier commissions.',
    },
    {
      q: 'How do tracked links work?',
      a: 'Each channel gets unique UTM parameters and short links. Clicks are logged for attribution so sales can be tied back to your campaign.',
    },
    {
      q: 'What is a white-labelled landing page?',
      a: 'A hosted page with your headline, note, and accent colour that recommends a single event—built for conversion on mobile.',
    },
    {
      q: 'When do I get paid?',
      a: 'MVP targets weekly payout cycles after a clearance window for refunds (see Refunds & commissions). You connect a payout method in onboarding.',
    },
    {
      q: 'Is there a fee to join?',
      a: 'No upfront fee for creators. You earn on performance; platform take rate may apply as disclosed per event.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <section className="relative py-24 md:py-32 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/12 via-transparent to-transparent" />
        <div className="page-shell relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Creators</p>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-[-0.03em] leading-[1.05]">
              Earn from the events you&apos;d go to anyway.
            </h1>
            <p className="text-xl md:text-2xl text-[#aaaaaa] mb-10 leading-relaxed">
              One marketplace for ticketed live events: browse, promote with tracked links or landing pages, get paid on sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply/creator">
                <Button variant="premium" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                  Apply as creator
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                  Browse marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">How you earn</h2>
          <p className="text-center text-[#aaaaaa] text-lg max-w-2xl mx-auto mb-14">
            Pick events that fit your audience. You earn commission when purchases are attributed to your links or landing pages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Marketplace',
                desc: 'Curated events with clear commission and dates—filter by city, category, and payout.',
                icon: ShoppingBag,
              },
              {
                title: 'Tracked links',
                desc: 'Per-channel links with UTM codes so every click and sale rolls up to your dashboard.',
                icon: Link2,
              },
              {
                title: 'Landing pages',
                desc: 'White-labelled, mobile-first pages with your headline, note, and brand accent.',
                icon: LayoutTemplate,
              },
              {
                title: 'Weekly payouts',
                desc: 'Commissions clear after the refund window, then move to your available balance for payout.',
                icon: Wallet,
              },
            ].map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/40 transition-colors"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-[#aaaaaa] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10 bg-white/[0.02]">
        <div className="page-shell">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">Earning examples</h2>
              <p className="text-[#aaaaaa] max-w-xl">Illustrative only—actual rates are set per event and shown before you publish.</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary/60 hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {earningExamples.map((ex) => (
              <div key={ex.label} className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/15 to-transparent p-6">
                <p className="text-sm text-offwhite/50 uppercase tracking-wider mb-2">{ex.label}</p>
                <p className="text-2xl font-bold text-white mb-1">{ex.ticket}</p>
                <p className="text-sm text-[#aaaaaa] mb-4">Creator commission {ex.rate}</p>
                <p className="text-lg font-semibold text-accent-green">{ex.you}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10 text-center">Creator FAQ</h2>
          <div>
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center border-b border-white/10">
        <div className="page-shell">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Application</h2>
          <p className="text-lg text-[#aaaaaa] mb-10 max-w-2xl mx-auto">
            Submit your handles, audience, and sample content. We manually approve creators for MVP, then you can build campaigns in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply/creator">
              <Button variant="premium" size="lg" className="h-14 px-10 text-lg inline-flex items-center gap-2 group">
                Start application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg text-white border-white/30 hover:bg-white/10">
                Already approved? Create account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
