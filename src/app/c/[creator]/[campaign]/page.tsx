import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { campaigns, creators, events } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

type PageParams = { creator: string; campaign: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  const creator = creators.find((c) => c.handle === resolvedParams.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === resolvedParams.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];
  const title = `${creator.name} recommends ${event.title} | Stagepass`;
  const description = `${campaign.headline} Tickets, tiers, and creator picks for ${event.title}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [event.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [event.image],
    },
  };
}

export default async function WhiteLabelLanding({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;
  const creator = creators.find((c) => c.handle === resolvedParams.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === resolvedParams.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: [event.image],
    location: {
      '@type': 'Place',
      name: event.venue,
      address: event.city,
    },
    organizer: {
      '@type': 'Organization',
      name: event.promoter,
    },
  };

  return (
    <div className="min-h-screen bg-[#121216] text-offwhite page-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-4 space-y-7">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span className="font-black tracking-tight text-white">Stagepass</span>
          </Link>
          <span className="text-[11px] uppercase tracking-wider text-offwhite/50">Creator page</span>
        </section>

        <section className="relative rounded-3xl overflow-hidden border border-white/10">
          <div className="relative aspect-[4/5] sm:aspect-[16/10]">
            <Image src={event.image} alt={event.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-0 premium-vignette" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-7 max-w-xl">
              <div className="inline-flex items-center rounded-full border border-primary/35 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-3">
                {event.date}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">{campaign.headline}</h1>
              <p className="text-sm text-[#b7b7c1] mt-3 leading-relaxed">{event.venue}, {event.city}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/60 shrink-0 shadow-[0_0_0_4px_rgba(83,74,183,0.15)]">
            <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-white text-lg truncate">{creator.name}</div>
            <div className="text-sm text-offwhite/60 truncate">{creator.niche} · {creator.audienceSize} community</div>
            <div className="text-xs text-accent-green mt-1">Trusted by 1,200+ ticket buyers in this category</div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-offwhite/50 mb-3">Personal recommendation</div>
          <p className="font-editorial text-2xl leading-relaxed text-offwhite/90 whitespace-pre-line">{campaign.note}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-offwhite/50 mb-4">Ticket tiers</div>
          <div className="space-y-3">
            {event.ticketTiers.map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 flex justify-between items-center gap-4">
                <div>
                  <div className="font-bold text-white text-lg">{tier.name}</div>
                  <div className="text-sm text-offwhite/55 leading-relaxed">{tier.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{formatCurrency(tier.price)}</div>
                  <div className="text-xs text-offwhite/45">Limited availability</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-offwhite/50 mb-3">Social proof</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: 'Sold', v: '1,240+' },
              { k: 'Rating', v: '4.8/5' },
              { k: 'Repeat', v: '34%' },
            ].map((item) => (
              <div key={item.k} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                <div className="text-lg font-black text-white">{item.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-offwhite/50 mt-1">{item.k}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-offwhite/50 mb-3">Trusted ticket providers</div>
          <div className="flex flex-wrap gap-2">
            {['Secure Checkout', 'Instant Confirmation', 'Verified Inventory'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full border border-white/15 text-xs text-offwhite/75 bg-black/20">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121216]/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Link href={`/go/${creator.handle}/${campaign.slug}`} className="flex-1">
            <Button variant="premium" className="w-full h-12 font-bold text-base">Get Tickets</Button>
          </Link>
          <Button variant="outline" className="h-12 text-white border-white/25">Share</Button>
        </div>
      </div>
    </div>
  );
}

