'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { campaigns, creators, events } from '@/data/mock';
import { Button } from '@/components/ui/button';

export default function RedirectDemo() {
  const params = useParams<{ creator: string; campaign: string }>();
  const search = useSearchParams();

  const creator = creators.find((c) => c.handle === params.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === params.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];

  const channel = search.get('utm_source') ?? 'instagram';

  const tracking = {
    creator_id: creator.id,
    campaign_id: campaign.id,
    channel,
    utm_source: search.get('utm_source') ?? '(none)',
    utm_medium: search.get('utm_medium') ?? '(none)',
    utm_campaign: search.get('utm_campaign') ?? '(none)',
  };

  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-offwhite/40">Attribution redirect demo</div>
            <h1 className="text-2xl font-black mt-2">Redirecting to ticketing partner</h1>
            <p className="text-sm text-offwhite/50 mt-2">
              This prototype page visualises what will be captured by the production tracking service.
            </p>
          </div>
          <Link href={`/c/${creator.handle}/${campaign.slug}`}>
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
              Back to landing
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl bg-dark border border-white/10 p-5 space-y-3">
          <div className="text-sm font-bold text-white">Mock tracking info</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {Object.entries(tracking).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-offwhite/40">{k}</div>
                <div className="text-offwhite/80 mt-1 break-all">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-offwhite/40 mb-2">Destination</div>
          <div className="text-white font-semibold">{event.title}</div>
          <div className="text-sm text-offwhite/50">
            {event.venue}, {event.city} · {event.date}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="premium" className="h-12 px-8 font-bold">
              Continue to ticketing partner
            </Button>
            <Link href="/events">
              <Button variant="ghost" className="h-12 px-8 text-primary hover:text-primary/80">
                Browse marketplace
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-offwhite/30">
          Production tracking service planned. Ticketing provider connection planned.
        </div>
      </div>
    </div>
  );
}
