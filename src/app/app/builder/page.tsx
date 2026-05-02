'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Stepper } from '@/components/shared/Stepper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { events as seedEvents } from '@/data/mock';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type BuilderFormat = 'Tracked link' | 'Landing page';
type BuilderDraft = {
  step: number;
  selectedEventId: string;
  format: BuilderFormat;
  slug: string;
  headline: string;
  note: string;
  accent: 'Primary' | 'Green';
  channels: Record<string, boolean>;
};

const steps = ['Brief', 'Format', 'Customise', 'Distribute', 'Launch'];
const stepSlugs = ['brief', 'format', 'customise', 'distribute', 'launch'];

function CampaignBuilderContent() {
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const didLoadRef = useRef(false);

  const [events, setEvents] = useState(seedEvents);
  const [selectedEventId, setSelectedEventId] = useState(seedEvents[0]?.id ?? '');
  const [format, setFormat] = useState<BuilderFormat>('Tracked link');
  const [slug, setSlug] = useState('maya-solstice');
  const [headline, setHeadline] = useState('Join me at this one.');
  const [note, setNote] = useState('My personal pick — great lineup, great crowd.');
  const [accent, setAccent] = useState<'Primary' | 'Green'>('Primary');
  const [channels, setChannels] = useState<Record<string, boolean>>({
    Instagram: true,
    TikTok: false,
    Newsletter: false,
    Podcast: false,
    'QR Code': false,
  });

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? events[0],
    [selectedEventId]
  );

  const checkedChannels = Object.entries(channels)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const mockBase = `https://stagepass.app/go/maya/${slug}`;
  const mockLanding = `https://stagepass.app/c/maya/${slug}`;

  const utmLinks = checkedChannels.map((ch) => ({
    channel: ch,
    url: `${mockBase}?utm_source=${encodeURIComponent(ch.toLowerCase())}&utm_medium=creator&utm_campaign=${encodeURIComponent(
      slug
    )}`,
  }));

  const projectedTickets = Math.max(3, Math.round(checkedChannels.length * 14));
  const projectedRevenue = projectedTickets * (selectedEvent?.ticketTiers?.[0]?.price ?? 150);
  const projectedCommission = projectedRevenue * ((selectedEvent?.commission ?? 12) / 100);

  const canBack = step > 0;
  const canNext = step < steps.length - 1;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const campaignParam = searchParams.get('campaign') ?? 'default-campaign';
  const initialisedFromQueryRef = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch('/api/public/events', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as { items?: typeof seedEvents };
      const items = json.items ?? [];
      if (!active || items.length === 0) return;
      setEvents(items);
      setSelectedEventId((prev) => prev || items[0].id);
    })();
    return () => {
      active = false;
    };
  }, []);

  const eventIdFromQuery = searchParams.get('event');
  useEffect(() => {
    if (!eventIdFromQuery) return;
    const match = events.find((e) => e.id === eventIdFromQuery);
    if (match) setSelectedEventId(match.id);
  }, [eventIdFromQuery, events]);

  useEffect(() => {
    if (initialisedFromQueryRef.current) return;
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const nextIndex = stepSlugs.indexOf(stepParam);
      if (nextIndex >= 0) setStep(nextIndex);
    }
    initialisedFromQueryRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!initialisedFromQueryRef.current) return;
    const currentStep = searchParams.get('step');
    const currentCampaign = searchParams.get('campaign') ?? 'default-campaign';
    const targetStep = stepSlugs[step];

    // Avoid replace-loop: only update URL when values are actually different.
    if (currentStep === targetStep && currentCampaign === campaignParam) return;

    const next = new URLSearchParams(searchParams.toString());
    next.set('step', targetStep);
    next.set('campaign', campaignParam);
    const url = `${pathname}?${next.toString()}`;
    // Defer navigation to after mount/commit so internal search-param state never updates too early (React 19 / Next 16).
    const t = window.setTimeout(() => {
      router.replace(url, { scroll: false });
    }, 0);
    return () => window.clearTimeout(t);
  }, [step, campaignParam, pathname, router, searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/builder/draft', { cache: 'no-store' });
        if (!res.ok) throw new Error('load_failed');
        const json = (await res.json()) as { draft: BuilderDraft | null; updatedAt: string | null };
        if (cancelled) return;
        if (json?.draft) {
          const d = json.draft as Partial<{
            step: number;
            selectedEventId: string;
            format: BuilderFormat;
            slug: string;
            headline: string;
            note: string;
            accent: 'Primary' | 'Green';
            channels: Record<string, boolean>;
          }>;
          if (typeof d.step === 'number') setStep(d.step);
          if (typeof d.selectedEventId === 'string') setSelectedEventId(d.selectedEventId);
          if (d.format === 'Tracked link' || d.format === 'Landing page') setFormat(d.format);
          if (typeof d.slug === 'string') setSlug(d.slug);
          if (typeof d.headline === 'string') setHeadline(d.headline);
          if (typeof d.note === 'string') setNote(d.note);
          if (d.accent === 'Primary' || d.accent === 'Green') setAccent(d.accent);
          if (d.channels && typeof d.channels === 'object') setChannels(d.channels);
          setSaveState('saved');
        }
        if (json?.updatedAt) setLastSavedAt(new Date(json.updatedAt));
      } catch {
        if (!cancelled) setSaveState('error');
      } finally {
        if (!cancelled) didLoadRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!didLoadRef.current) return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    setSaveState('saving');
    saveTimerRef.current = window.setTimeout(async () => {
      try {
        const payload = {
          step,
          selectedEventId,
          format,
          slug,
          headline,
          note,
          accent,
          channels,
        };
        const res = await fetch('/api/builder/draft', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('save_failed');
        const json = (await res.json()) as { updatedAt?: string };
        if (json.updatedAt) setLastSavedAt(new Date(json.updatedAt));
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 800);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [step, selectedEventId, format, slug, headline, note, accent, channels]);

  const statusLabel = (() => {
    if (saveState === 'saving') return 'Saving…';
    if (saveState === 'error') return 'Save failed';
    if (saveState === 'saved' && lastSavedAt) return `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (saveState === 'saved') return 'Saved';
    return 'Auto-save';
  })();

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Campaign Builder</h1>
            <p className="text-offwhite/40">Create a tracked link or a white-labelled landing page.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="premium" className="border-white/10 text-offwhite/80">
              {statusLabel}
            </Badge>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={async () => {
                try {
                  setSaveState('saving');
                  const payload = {
                    step,
                    selectedEventId,
                    format,
                    slug,
                    headline,
                    note,
                    accent,
                    channels,
                  };
                  const res = await fetch('/api/builder/draft', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error('save_failed');
                  const json = (await res.json()) as { updatedAt?: string };
                  if (json.updatedAt) setLastSavedAt(new Date(json.updatedAt));
                  setSaveState('saved');
                } catch {
                  setSaveState('error');
                }
              }}
            >
              Save now
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <Stepper steps={steps} currentIndex={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest mb-2">Event</div>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title} — {e.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-white/10 bg-dark p-5">
                  <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest mb-2">Brief</div>
                  <div className="text-white font-semibold">{selectedEvent?.title}</div>
                  <div className="text-sm text-offwhite/50 mt-1">
                    {selectedEvent?.date} · {selectedEvent?.venue}, {selectedEvent?.city}
                  </div>
                  <div className="mt-4 text-sm text-offwhite/60 leading-relaxed">
                    {selectedEvent?.description}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest">Format</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormat('Tracked link')}
                    className={`p-6 rounded-2xl border text-left transition-colors ${
                      format === 'Tracked link'
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-dark hover:bg-white/5'
                    }`}
                  >
                    <div className="text-white font-bold mb-2">Tracked link</div>
                    <div className="text-sm text-offwhite/50">
                      Fastest setup. Perfect for stories, captions, and DMs.
                    </div>
                  </button>
                  <button
                    onClick={() => setFormat('Landing page')}
                    className={`p-6 rounded-2xl border text-left transition-colors ${
                      format === 'Landing page'
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-dark hover:bg-white/5'
                    }`}
                  >
                    <div className="text-white font-bold mb-2">White-labelled landing page</div>
                    <div className="text-sm text-offwhite/50">
                      Premium conversion. Adds creator copy, ticket tiers, and proof.
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest">Customise</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-offwhite/60 mb-2">Slug</div>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                      placeholder="creator-campaign"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-offwhite/60 mb-2">Brand accent</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAccent('Primary')}
                        className={`flex-1 p-3 rounded-xl border ${
                          accent === 'Primary' ? 'border-primary bg-primary/10' : 'border-white/10 bg-dark'
                        }`}
                      >
                        <div className="text-white font-semibold">Primary</div>
                        <div className="text-xs text-offwhite/40">#534AB7</div>
                      </button>
                      <button
                        onClick={() => setAccent('Green')}
                        className={`flex-1 p-3 rounded-xl border ${
                          accent === 'Green' ? 'border-accent-green bg-accent-green/10' : 'border-white/10 bg-dark'
                        }`}
                      >
                        <div className="text-white font-semibold">Green</div>
                        <div className="text-xs text-offwhite/40">#1D9E75</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-offwhite/60 mb-2">Headline</div>
                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    placeholder="Write a punchy headline"
                  />
                </div>
                <div>
                  <div className="text-sm text-offwhite/60 mb-2">Personal note</div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary min-h-28"
                    placeholder="Add your recommendation..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest">Distribute</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-dark p-5">
                    <div className="text-white font-bold mb-4">Channels</div>
                    <div className="space-y-3">
                      {Object.keys(channels).map((ch) => (
                        <label key={ch} className="flex items-center gap-3 text-offwhite/80">
                          <input
                            type="checkbox"
                            checked={channels[ch]}
                            onChange={(e) => setChannels((prev) => ({ ...prev, [ch]: e.target.checked }))}
                            className="w-4 h-4 accent-primary"
                          />
                          {ch}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-dark p-5">
                    <div className="text-white font-bold mb-4">Earnings projection</div>
                    <div className="text-sm text-offwhite/60">
                      Based on mock benchmarks and the selected channels.
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-offwhite/60">Projected tickets</span>
                        <span className="text-white font-semibold">{projectedTickets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-offwhite/60">Projected revenue</span>
                        <span className="text-white font-semibold">{formatCurrency(projectedRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-offwhite/60">Projected commission</span>
                        <span className="text-accent-green font-semibold">
                          {formatCurrency(projectedCommission)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-dark p-5">
                  <div className="text-white font-bold mb-4">Generated UTM links (mock)</div>
                  <div className="space-y-3">
                    {utmLinks.length === 0 ? (
                      <div className="text-sm text-offwhite/40">Select at least one channel.</div>
                    ) : (
                      utmLinks.map((l) => (
                        <div key={l.channel} className="flex flex-col gap-1">
                          <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">
                            {l.channel}
                          </div>
                          <div className="text-sm text-offwhite/80 break-all bg-white/5 border border-white/10 rounded-lg p-3">
                            {l.url}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest">Launch</div>
                <div className="rounded-xl border border-white/10 bg-dark p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-bold">Summary</div>
                    <Badge variant="premium" className="border-white/10 text-offwhite/80">
                      Draft
                    </Badge>
                  </div>
                  <div className="text-sm text-offwhite/60">
                    Event: <span className="text-white font-medium">{selectedEvent?.title}</span>
                  </div>
                  <div className="text-sm text-offwhite/60">
                    Format: <span className="text-white font-medium">{format}</span>
                  </div>
                  <div className="text-sm text-offwhite/60">
                    Slug: <span className="text-white font-medium">{slug}</span>
                  </div>
                  <div className="text-sm text-offwhite/60">
                    Headline: <span className="text-white font-medium">{headline}</span>
                  </div>
                  <div className="text-sm text-offwhite/60">
                    Channels: <span className="text-white font-medium">{checkedChannels.join(', ') || '—'}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-dark p-5">
                  <div className="text-white font-bold mb-3">Generated URLs (prototype)</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">Short link</div>
                      <div className="text-sm text-offwhite/80 break-all bg-white/5 border border-white/10 rounded-lg p-3">
                        {mockBase}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest">
                        Landing page
                      </div>
                      <div className="text-sm text-offwhite/80 break-all bg-white/5 border border-white/10 rounded-lg p-3">
                        {mockLanding}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="premium" className="h-12 px-8 font-bold">
                    Publish campaign
                  </Button>
                  <Link href={`/go/maya/${slug}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full h-12 text-white border-white/10 hover:bg-white/5">
                      Preview redirect demo
                    </Button>
                  </Link>
                  <Link href={`/c/maya/${slug}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full h-12 text-white border-white/10 hover:bg-white/5">
                      Preview landing page
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
            <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest mb-3">Live Preview</div>
            <div
              className={`rounded-2xl border p-5 ${
                accent === 'Primary' ? 'border-primary/30 bg-primary/5' : 'border-accent-green/30 bg-accent-green/5'
              }`}
            >
              <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Headline</div>
              <div className="text-white font-black text-xl leading-snug">{headline || '—'}</div>
              <div className="mt-4 text-xs font-bold text-offwhite/40 uppercase tracking-widest">Note</div>
              <div className="text-offwhite/70 text-sm mt-1 leading-relaxed">{note || '—'}</div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-offwhite/50 text-xs">
                  {selectedEvent?.city} · {format}
                </div>
                <div className="text-accent-green text-sm font-semibold">
                  {formatCurrency(projectedCommission)}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="text-white border-white/10 hover:bg-white/5"
            disabled={!canBack}
            onClick={() => {
              const nextStep = Math.max(0, step - 1);
              setStep(nextStep);
            }}
          >
            Back
          </Button>
          <Button
            variant="premium"
            disabled={!canNext}
            onClick={() => {
              const nextStep = Math.min(steps.length - 1, step + 1);
              setStep(nextStep);
            }}
          >
            Next
          </Button>
        </div>

        <div className="text-xs text-offwhite/30">
          Stripe Connect integration planned for production phase. Production tracking service planned.
        </div>
      </div>
    </DashboardShell>
  );
}

export default function CampaignBuilder() {
  return (
    <Suspense fallback={<DashboardShell><div className="rounded-2xl border border-white/10 bg-white/5 p-6 loading-shimmer">Loading builder...</div></DashboardShell>}>
      <CampaignBuilderContent />
    </Suspense>
  );
}
