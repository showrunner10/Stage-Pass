'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicInteriorHero } from '@/components/layout/PublicInteriorHero';
import { Sparkles, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

/** Stock portraits for layout until launch comms — replace with real headshots + names in `teamRoles`. */
const teamRoles = [
  {
    discipline: 'Product & partnerships',
    caption: 'GTM, promoters, creator programs',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    imageAlt: 'Stock photo — product & partnerships lead (placeholder)',
  },
  {
    discipline: 'Engineering',
    caption: 'Platform, data, ticketing integrations',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80',
    imageAlt: 'Stock photo — engineering lead (placeholder)',
  },
  {
    discipline: 'Operations',
    caption: 'Payouts, trust & safety, support',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
    imageAlt: 'Stock photo — operations lead (placeholder)',
  },
] as const;

const values = [
  {
    title: 'Creator-first',
    desc: 'Fair performance pay, transparent numbers, and tools that respect how culture is actually promoted.',
    icon: Sparkles,
  },
  {
    title: 'Inventory truth',
    desc: 'Caps and tiers so sell-outs and allocations stay honest for promoters and fans.',
    icon: Target,
  },
  {
    title: 'Attribution you can defend',
    desc: 'Channel-level data finance and marketing can agree on—no mystery spreadsheet math.',
    icon: Zap,
  },
  {
    title: 'Community',
    desc: 'Built with AU festivals, venues, and creators in the loop—not generic SaaS templates.',
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <PublicInteriorHero eyebrow="About Stagepass" title="The live-event creator marketplace.">
        <p className="text-lg md:text-xl text-offwhite/70 leading-relaxed max-w-3xl text-balance">
          We connect ticketed events with creators who already influence the right audiences—tracking, inventory discipline,
          and payouts that don&apos;t depend on spreadsheets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/apply/creator">
            <Button variant="premium" size="lg" className="h-14 px-10 text-lg w-full sm:w-auto">
              Apply as creator
            </Button>
          </Link>
          <Link href="/contact?intent=demo">
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg w-full sm:w-auto text-white border-white/25 hover:bg-white/10">
              Book a demo
            </Button>
          </Link>
        </div>
      </PublicInteriorHero>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="marketing-panel marketing-panel-hover p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6 relative">Why this category exists</h2>
              <p className="text-offwhite/65 leading-relaxed mb-4 relative">
                Affiliate stacks were built for e-commerce SKUs—not hard caps, sell-out windows, or tier psychology. Ticketing
                platforms bolt on referrals, but they aren&apos;t a creator marketplace with approvals and channel truth.
              </p>
              <p className="text-offwhite/65 leading-relaxed relative">
                Stagepass sits at the intersection: <span className="text-white font-semibold">event inventory</span> +{' '}
                <span className="text-white font-semibold">creator distribution</span> +{' '}
                <span className="text-white font-semibold">commercial-grade attribution</span>.
              </p>
            </div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 min-h-[280px] lg:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop"
                alt="Festival crowd"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 text-sm text-offwhite/80 font-medium">
                Premium, Tixr-grade commerce UX—dark, confident, event-native.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section border-b border-white/10 bg-black/35">
        <div className="page-shell max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="marketing-panel p-8 border-red-500/15 bg-red-500/[0.04]">
              <h2 className="text-2xl font-black text-white mb-4">Creator problem</h2>
              <p className="text-offwhite/65 leading-relaxed">
                One-off UTMs, opaque reconciliation, slow payouts. Culture makers need one place to browse events, ship
                campaigns fast, and see numbers that match the bank.
              </p>
            </div>
            <div className="marketing-panel p-8 border-primary/20 bg-primary/[0.06]">
              <h2 className="text-2xl font-black text-white mb-4">Promoter problem</h2>
              <p className="text-offwhite/65 leading-relaxed">
                Outreach and contracts don&apos;t scale. Without caps and channel-level attribution, teams argue about what
                sold—and creators lose trust when money lags.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">Our mission</h2>
          <p className="text-offwhite/60 text-center max-w-2xl mx-auto mb-14 text-lg">
            Events are where culture happens. We put creators first without letting promoters lose control of the floor.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { title: 'For creators', desc: 'One login, curated events, links & landing pages, predictable payouts.' },
              { title: 'For promoters', desc: 'Vetted reach, caps, tiers, sales tied to people and channels.' },
              { title: 'For punters', desc: 'Recommendations that feel personal—not a corporate funnel.' },
            ].map((item) => (
              <div key={item.title} className="marketing-panel marketing-panel-hover p-8 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-offwhite/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 text-center">What we believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="marketing-panel marketing-panel-hover p-8 flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-offwhite/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section border-b border-white/10 bg-offwhite text-dark">
        <div className="page-shell max-w-4xl mx-auto text-center">
          <p className="font-editorial text-2xl md:text-3xl leading-relaxed text-dark/90 mb-6">
            “We’re not adding another affiliate widget—we’re building the rails for how live events actually move tickets
            through real people.”
          </p>
          <p className="text-sm font-semibold text-dark/50 uppercase tracking-widest">Company story · internal north star</p>
        </div>
      </section>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">Team</h2>
          <p className="text-center text-offwhite/55 max-w-xl mx-auto mb-4">
            People behind Stagepass—official names and bios ship with public launch. Below uses stock photography so the page
            doesn&apos;t look empty while comms are prepared.
          </p>
          <p className="text-center text-xs text-offwhite/40 uppercase tracking-widest mb-14">Placeholder portraits · not implied endorsements</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamRoles.map((member) => (
              <div
                key={member.discipline}
                className="marketing-panel marketing-panel-hover p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-5 rounded-2xl overflow-hidden border border-white/15 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="relative text-lg font-bold text-white mb-1">{member.discipline}</h3>
                <p className="relative text-sm text-offwhite/55 mb-3">{member.caption}</p>
                <p className="relative text-xs font-semibold uppercase tracking-wider text-primary/90">Name · at launch</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section">
        <div className="page-shell max-w-4xl mx-auto">
          <div className="marketing-panel p-10 md:p-14 text-center border-primary/25 bg-gradient-to-b from-primary/[0.08] to-transparent">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Work with us</h2>
            <p className="text-offwhite/65 text-lg mb-10 max-w-xl mx-auto">
              Creators: apply. Promoters: book a demo. We&apos;ll align on events, inventory, and first campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/creator">
                <Button variant="premium" size="lg" className="h-14 px-10 text-lg">
                  Apply as creator
                </Button>
              </Link>
              <Link href="/contact?intent=demo">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg text-white border-white/25 hover:bg-white/10">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
