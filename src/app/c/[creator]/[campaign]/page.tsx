import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { campaigns, creators, events } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

type PageParams = { creator: string; campaign: string };

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const creator = creators.find((c) => c.handle === resolvedParams.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === resolvedParams.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];
  const title = `${creator.name} recommends ${event.title} | Stagepass`;
  const description = `${campaign.headline} · ${event.venue}, ${event.city}. ${event.description.slice(0, 140)}…`;
  const canonical = `${SITE}/c/${resolvedParams.creator}/${resolvedParams.campaign}`;
  return {
    title,
    description,
    keywords: [event.title, event.city, 'tickets', creator.name, 'live events', event.category],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Stagepass',
      locale: 'en_AU',
      images: [{ url: event.image, width: 1200, height: 630, alt: event.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [event.image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function WhiteLabelLanding({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;
  const creator = creators.find((c) => c.handle === resolvedParams.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === resolvedParams.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];
  const accent = campaign.accentColor ?? '#534AB7';
  const partner = event.ticketingPartner ?? 'ticketing partner';
  const credibility =
    `${creator.tier} tier creator · ${creator.niche} · ${creator.audienceSize} across channels`;

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: [event.image],
    startDate: '2026-12-20T10:00:00+10:00',
    endDate: '2026-12-22T23:00:00+10:00',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: 'AU',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.promoter,
    },
    offers: event.ticketTiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.price,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      url: event.ticketingUrl ?? canonicalUrl(resolvedParams),
    })),
  };

  return (
    <div
      className="min-h-screen text-offwhite page-fade-in pb-28"
      style={{
        background: `linear-gradient(180deg, ${accent}14 0%, #121216 18%, #121216 100%)`,
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <main className="max-w-lg sm:max-w-2xl mx-auto px-4 pt-3 sm:pt-6 space-y-5 sm:space-y-6">
        <header className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 shadow-lg"
              style={{ backgroundColor: accent }}
            >
              S
            </div>
            <span className="font-black tracking-tight text-white truncate text-sm sm:text-base">Stagepass</span>
          </Link>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-offwhite/45 shrink-0 text-right leading-tight">
            Creator pick
          </span>
        </header>

        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
          <div
            className="absolute inset-0 opacity-90 pointer-events-none"
            style={{
              background: `radial-gradient(120% 80% at 20% 0%, ${accent}55 0%, transparent 55%)`,
            }}
          />
          <div className="relative aspect-[4/5] sm:aspect-[16/10] max-h-[min(72vh,520px)] sm:max-h-none">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div
                className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold mb-3"
                style={{ borderColor: `${accent}88`, backgroundColor: `${accent}33`, color: '#f4f4f8' }}
              >
                {event.date} · {event.city}
              </div>
              <h1 className="text-[1.65rem] sm:text-4xl md:text-5xl font-black text-white leading-[1.08] tracking-tight">
                {campaign.headline}
              </h1>
              <p className="text-sm text-offwhite/70 mt-3 leading-relaxed">
                {event.venue} · Presented by {event.promoter}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6 flex gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 shrink-0 shadow-[0_0_0_3px_rgba(83,74,183,0.2)]" style={{ borderColor: accent }}>
            <Image src={creator.avatar} alt={creator.name} fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-white text-lg leading-tight">{creator.name}</div>
            <p className="text-xs sm:text-sm text-offwhite/60 mt-1 leading-snug">{credibility}</p>
            <p className="text-[11px] sm:text-xs text-accent-green mt-2 font-medium">
              Personal recommendation — not a generic ad unit.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-offwhite/45 mb-3">Personal note</div>
          <p className="font-editorial text-xl sm:text-2xl leading-relaxed text-offwhite/92 whitespace-pre-line">
            {campaign.note}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-offwhite/45">Ticket tiers</div>
            <span className="text-[10px] text-offwhite/40">Prices inc. GST where applicable</span>
          </div>
          <div className="space-y-3">
            {event.ticketTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
              >
                <div className="min-w-0">
                  <div className="font-bold text-white text-base sm:text-lg">{tier.name}</div>
                  <div className="text-sm text-offwhite/55 leading-relaxed">{tier.description}</div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-white">{formatCurrency(tier.price)}</div>
                  <div className="text-[11px] text-offwhite/45">Compare on checkout</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-offwhite/45 mb-3">Social proof</div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { k: 'Sold via Stagepass', v: '1,240+' },
              { k: 'Satisfaction', v: '4.8/5' },
              { k: 'Repeat buyers', v: '34%' },
            ].map((item) => (
              <div key={item.k} className="rounded-xl border border-white/10 bg-black/25 p-3 text-center">
                <div className="text-base sm:text-lg font-black text-white">{item.v}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-offwhite/50 mt-1 leading-tight">
                  {item.k}
                </div>
              </div>
            ))}
          </div>
        </section>

        {campaign.testimonial && (
          <section className="rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-offwhite/45 mb-3">What people say</div>
            <blockquote className="font-editorial text-lg sm:text-xl text-offwhite/90 leading-relaxed">
              “{campaign.testimonial.quote}”
            </blockquote>
            <cite className="not-italic text-sm text-offwhite/50 mt-3 block">— {campaign.testimonial.attribution}</cite>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
          <p className="text-sm text-offwhite/75 text-center leading-relaxed">
            <span className="text-white font-semibold">Secure checkout</span> via {partner}. You complete purchase on the official
            ticketing site — Stagepass records attribution for this creator campaign.
          </p>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-[#0a0b10]/92 backdrop-blur-lg border-t border-white/10 safe-area-pb">
        <div className="max-w-lg sm:max-w-2xl mx-auto flex gap-3">
          <Link href={`/go/${creator.handle}/${campaign.slug}`} className="flex-1 min-w-0">
            <Button
              className="w-full h-12 sm:h-14 font-bold text-base shadow-[0_12px_40px_-12px_rgba(83,74,183,0.9)] border-0"
              style={{ backgroundColor: accent }}
            >
              Buy tickets
            </Button>
          </Link>
          <Button type="button" variant="outline" className="h-12 sm:h-14 text-white border-white/25 shrink-0 px-4">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

function canonicalUrl(p: PageParams) {
  return `${SITE}/c/${p.creator}/${p.campaign}`;
}
