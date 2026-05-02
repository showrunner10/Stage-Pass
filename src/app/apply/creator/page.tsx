'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ApplyCreatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    audienceSize: '',
    niche: '',
    cityRegion: '',
    sampleLinks: '',
    accountAgeNote: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/public/creator-application', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.');
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <section className="py-16 md:py-24 border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-sm text-offwhite/60 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to For Creators
          </Link>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Apply as a creator</h1>
          <p className="text-lg text-[#aaaaaa] leading-relaxed mb-2">
            Tell us about your audience and channels. For MVP we review applications manually—usually within a few business days.
          </p>
          <p className="text-sm text-offwhite/45 mb-10">
            Follower verification via Instagram / TikTok APIs is planned; for now we review handles and sample content you provide.
          </p>

          {done ? (
            <div className="rounded-2xl border border-accent-green/30 bg-accent-green/10 p-8 text-center">
              <CheckCircle2 className="w-14 h-14 text-accent-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Application received</h2>
              <p className="text-[#aaaaaa] mb-6">
                We&apos;ll email you at <span className="text-white font-medium">{form.email}</span> after review. You can create an account anytime—approval may be required before marketplace access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login?mode=signup">
                  <Button variant="premium" className="h-12 px-8">
                    Create account
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="h-12 px-8 text-white border-white/25">
                    Browse events
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Full name *</label>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white mb-3">Social handles</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={form.instagram}
                    onChange={(e) => update('instagram', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="Instagram @handle"
                  />
                  <input
                    value={form.tiktok}
                    onChange={(e) => update('tiktok', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="TikTok @handle"
                  />
                  <input
                    value={form.youtube}
                    onChange={(e) => update('youtube', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="YouTube channel URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Audience size (estimate) *</label>
                  <input
                    required
                    value={form.audienceSize}
                    onChange={(e) => update('audienceSize', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="e.g. 24k IG, 12k TikTok"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Niche / category *</label>
                  <input
                    required
                    value={form.niche}
                    onChange={(e) => update('niche', e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                    placeholder="e.g. Music & festivals"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">City / region *</label>
                <input
                  required
                  value={form.cityRegion}
                  onChange={(e) => update('cityRegion', e.target.value)}
                  className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
                  placeholder="e.g. Sydney, NSW"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Sample content links *</label>
                <textarea
                  required
                  rows={4}
                  value={form.sampleLinks}
                  onChange={(e) => update('sampleLinks', e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary resize-none"
                  placeholder="Paste 2–5 URLs (posts, reels, portfolio)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Account notes (optional)</label>
                <textarea
                  rows={2}
                  value={form.accountAgeNote}
                  onChange={(e) => update('accountAgeNote', e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary resize-none"
                  placeholder="e.g. Main IG account active since 2019"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button type="submit" variant="premium" className="h-12 px-10" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit application'}
                </Button>
                <p className="text-xs text-offwhite/45 self-center">
                  By submitting you agree to our{' '}
                  <Link href="/legal/terms" className="text-primary hover:underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
