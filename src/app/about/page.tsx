'use client';

import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <section className="py-24 md:py-32 border-b border-white/10">
        <div className="page-shell max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Stagepass mission</p>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-[-0.03em]">The live-event creator marketplace</h1>
          <p className="text-xl text-[#aaaaaa] leading-relaxed max-w-3xl">
            We connect ticketed events with creators who already influence the right audiences—with tracking, inventory
            discipline, and payouts that don&apos;t depend on spreadsheets.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="page-shell max-w-4xl">
          <h2 className="text-4xl font-black text-white mb-6">Why this category exists</h2>
          <p className="text-lg text-[#aaaaaa] leading-relaxed mb-6">
            Affiliate tools were built for e-commerce SKUs, not hard caps and sell-out windows. Ticketing platforms bolt on
            referrals, but they don&apos;t offer a true creator marketplace where promoters can approve, cap, and attribute
            every sale to a person and channel.
          </p>
          <p className="text-lg text-[#aaaaaa] leading-relaxed">
            Stagepass sits at that intersection: event inventory + creator distribution + commercial-grade attribution.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10 bg-white/[0.02]">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Creator problem</h2>
              <p className="text-[#aaaaaa] leading-relaxed mb-4">
                Too many one-off UTM links, opaque reconciliation, and slow payouts. Culture makers want one place to browse
                events, launch campaigns in minutes, and see real numbers.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Promoter problem</h2>
              <p className="text-[#aaaaaa] leading-relaxed mb-4">
                Creator outreach and contracts don&apos;t scale. Without inventory caps and channel-level attribution, finance
                and marketing disagree on what actually sold—and creators lose trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="page-shell max-w-4xl">
          <h2 className="text-4xl font-black text-white mb-6">Our mission</h2>
          <p className="text-lg text-[#aaaaaa] leading-relaxed mb-6">
            Events are where culture happens. Stagepass puts creators first: fair performance pay, transparent attribution,
            and promoter controls that protect the brand and the floor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'For creators', desc: 'One login, curated events, tracked links and landing pages, weekly-style payouts.' },
              { title: 'For promoters', desc: 'Vetted distribution, caps, tiers, and sales tied to creators and channels.' },
              { title: 'For punters', desc: 'Recommendations that feel personal—not a generic corporate funnel.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#aaaaaa] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="page-shell max-w-4xl">
          <h2 className="text-4xl font-black text-white mb-4">Company story</h2>
          <p className="text-lg text-[#aaaaaa] leading-relaxed mb-4">
            Stagepass is built by people who&apos;ve lived the festival floor, the promoter inbox, and the creator DMs. The
            product roadmap follows a simple rule: if it doesn&apos;t make attribution or payouts more honest, it waits.
          </p>
          <p className="text-lg text-[#aaaaaa] leading-relaxed">
            We&apos;re headquartered in Australia with a premium, Tixr-grade bar for public and dashboard UX—no generic
            &quot;SaaS gradient&quot; hand-waving.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="page-shell">
          <h2 className="text-4xl font-black text-white mb-4 text-center">Team</h2>
          <p className="text-center text-[#aaaaaa] max-w-2xl mx-auto mb-12">
            Core team + extended network across events, payments, and growth. Detailed bios ship with the public launch site.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {['Product & partnerships', 'Engineering', 'Operations'].map((label) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 border border-primary/30" />
                <h3 className="text-lg font-bold text-white mb-1">{label}</h3>
                <p className="text-sm text-[#aaaaaa]">Roles and names to be updated for launch comms.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="page-shell">
          <h2 className="text-4xl font-black text-white mb-6">Work with us</h2>
          <p className="text-xl text-[#aaaaaa] mb-10 max-w-2xl mx-auto">
            Creators: apply. Promoters: book a demo. We&apos;ll get you to first live campaign as fast as inventory allows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply/creator">
              <Button variant="premium" size="lg" className="h-14 px-10">
                Apply as creator
              </Button>
            </Link>
            <Link href="/contact?intent=demo">
              <Button variant="outline" size="lg" className="h-14 px-10 text-white border-white/30 hover:bg-white/10">
                Book a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
