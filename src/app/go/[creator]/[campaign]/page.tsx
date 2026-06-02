'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { campaigns, creators, events } from '@/data/mock';
import { Button } from '@/components/ui/button';

function buildPartnerUrl(
  base: string,
  creatorHandle: string,
  campaignSlug: string,
  search: URLSearchParams,
) {
  try {
    const u = new URL(base);
    const utmSource = search.get('utm_source') ?? 'direct';
    const utmMedium = search.get('utm_medium') ?? 'creator';
    const utmCampaign = search.get('utm_campaign') ?? campaignSlug;

    if (u.hostname === 'tickets.example.com') {
      const localCheckout = new URLSearchParams();
      localCheckout.set('utm_source', utmSource);
      localCheckout.set('utm_medium', utmMedium);
      localCheckout.set('utm_campaign', utmCampaign);
      localCheckout.set('sp_creator', creatorHandle);
      localCheckout.set('sp_campaign', campaignSlug);
      localCheckout.set('sp_preview', 'true');
      return `/checkout/demo-${campaignSlug}?${localCheckout.toString()}`;
    }

    u.searchParams.set('utm_source', utmSource);
    u.searchParams.set('utm_medium', utmMedium);
    u.searchParams.set('utm_campaign', utmCampaign);
    u.searchParams.set('sp_creator', creatorHandle);
    u.searchParams.set('sp_campaign', campaignSlug);
    return u.toString();
  } catch {
    return base;
  }
}

function ShortLinkRedirect() {
  const params = useParams<{ creator: string; campaign: string }>();
  const search = useSearchParams();
  const [showFallback, setShowFallback] = useState(false);

  const creator = creators.find((c) => c.handle === params.creator) ?? creators[0];
  const campaign = campaigns.find((c) => c.slug === params.campaign) ?? campaigns[0];
  const event = events.find((e) => e.id === campaign.eventId) ?? events[0];

  const destination = useMemo(() => {
    if (!event.ticketingUrl) return null;
    return buildPartnerUrl(event.ticketingUrl, creator.handle, campaign.slug, search);
  }, [event.ticketingUrl, creator.handle, campaign.slug, search]);
  const isLocalCheckoutPreview = destination?.startsWith('/checkout/');

  useEffect(() => {
    if (!destination) {
      setShowFallback(true);
      return;
    }
    const t = window.setTimeout(() => {
      window.location.assign(destination);
    }, 120);
    return () => window.clearTimeout(t);
  }, [destination]);

  if (showFallback || !destination) {
    const tracking = {
      creator_id: creator.id,
      campaign_id: campaign.id,
      utm_source: search.get('utm_source') ?? '(none)',
      utm_medium: search.get('utm_medium') ?? '(none)',
      utm_campaign: search.get('utm_campaign') ?? '(none)',
    };

    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-offwhite/40">Attribution redirect</div>
              <h1 className="text-2xl font-black mt-2">No ticketing URL on this demo event</h1>
              <p className="text-sm text-offwhite/50 mt-2">
                Production events carry a partner checkout URL. This mock shows the attribution payload only.
              </p>
            </div>
            <Link href={`/c/${creator.handle}/${campaign.slug}`}>
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                Back to landing
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl bg-dark border border-white/10 p-5 space-y-3">
            <div className="text-sm font-bold text-white">Params preserved for partner</div>
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
            <div className="text-xs font-bold uppercase tracking-widest text-offwhite/40 mb-2">Event</div>
            <div className="text-white font-semibold">{event.title}</div>
            <div className="text-sm text-offwhite/50">
              {event.venue}, {event.city} · {event.date}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-12 h-12 rounded-2xl bg-primary/30 border border-primary/50 animate-pulse mb-6" />
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-offwhite/45 mb-2">Redirecting</p>
      <h1 className="text-xl font-black text-center">
        Taking you to {isLocalCheckoutPreview ? 'Stagepass checkout preview' : event.ticketingPartner ?? 'checkout'}
      </h1>
      <p className="text-sm text-offwhite/50 mt-2 text-center max-w-sm">
        Attribution params are appended for order matching. If nothing happens,{' '}
        <Link href={destination} className="text-primary underline underline-offset-2">
          tap here
        </Link>
        .
      </p>
    </div>
  );
}

export default function ShortLinkRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark flex items-center justify-center text-offwhite/60 text-sm">Loading…</div>
      }
    >
      <ShortLinkRedirect />
    </Suspense>
  );
}
