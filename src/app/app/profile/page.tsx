'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/components/ui/toast-store';

type ProfileState = {
  displayName: string;
  handle: string;
  bio: string;
  niche: string;
  audienceSize: string;
  instagram: string;
  tiktok: string;
  youtube: string;
};

const emptyProfile: ProfileState = {
  displayName: '',
  handle: '',
  bio: '',
  niche: '',
  audienceSize: '',
  instagram: '',
  tiktok: '',
  youtube: '',
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileState>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialProfile, setInitialProfile] = useState<ProfileState>(emptyProfile);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/app/profile', { cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as { item?: ProfileState; error?: string };
        if (!active) return;
        if (!res.ok || !json.item) {
          setError(json.error ?? 'Could not load profile.');
          return;
        }
        setProfile(json.item);
        setInitialProfile(json.item);
      } catch {
        if (active) setError('Could not load profile.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(initialProfile), [profile, initialProfile]);

  function update<K extends keyof ProfileState>(key: K, value: ProfileState[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/app/profile', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        const message = json.error ?? 'Could not save profile.';
        setError(message);
        toast.error('Profile not saved', message);
        return;
      }
      setInitialProfile(profile);
      setMessage('Profile saved.');
      toast.success('Profile saved', 'Your creator profile has been updated.');
    } catch {
      setError('Could not save profile.');
      toast.error('Profile not saved', 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Creator Profile</h1>
            <p className="text-offwhite/40">Your public presence, subdomain, and payout readiness.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5" asChild>
              <Link href="/app/builder">Open Link Builder</Link>
            </Button>
            <Button variant="premium" disabled={saving || loading || !dirty} onClick={save}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div> : null}
        {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">{message}</div> : null}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xl">
            {(profile.displayName || 'SP').split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="text-white font-bold text-xl">{profile.displayName || 'Creator profile'}</div>
            <div className="text-offwhite/40 text-sm">@{profile.handle || 'creator.handle'}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-offwhite/80">
            <span className="text-white font-semibold">Public page:</span>{' '}
            <span className="text-primary">{profile.handle || 'creator.handle'}.stage.page</span>
            <span className="text-offwhite/45"> · resolves to </span>
            <span className="text-offwhite/70">/c/{profile.handle || 'creator.handle'}/…</span> until wildcard DNS is connected.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Display name" value={profile.displayName} onChange={(value) => update('displayName', value)} />
            <Field label="Subdomain (handle)" value={profile.handle} onChange={(value) => update('handle', value)} />
          </div>

          <Field label="Niche" value={profile.niche} onChange={(value) => update('niche', value)} />

          <div>
            <div className="text-sm text-offwhite/60 mb-2">Bio</div>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => update('bio', e.target.value)}
              className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Instagram" value={profile.instagram} onChange={(value) => update('instagram', value)} />
            <Field label="TikTok" value={profile.tiktok} onChange={(value) => update('tiktok', value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="YouTube" value={profile.youtube} onChange={(value) => update('youtube', value)} placeholder="Channel URL" />
            <Field label="Audience size" value={profile.audienceSize} onChange={(value) => update('audienceSize', value)} />
          </div>

          <div className="rounded-xl border border-white/10 bg-dark p-5">
            <div className="text-white font-bold mb-2">Brand kit</div>
            <div className="text-sm text-offwhite/50">
              Upload avatar, cover image, and approved copy in production phase.
            </div>
            <div className="text-xs text-offwhite/40 mt-3">
              Creators get official assets from each listing&apos;s <strong className="text-offwhite/60">promoter asset pack</strong> (logos,
              banners, copy, UTM guidance). Download from the event page or marketplace brief. You can add your own avatar and cover here.
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-dark p-5">
            <div className="text-white font-bold mb-2">Payout settings</div>
            <div className="text-sm text-offwhite/50">
              Stripe Connect onboarding is the remaining external dependency for live payouts.
            </div>
            <div className="mt-4">
              <Button variant="premium" disabled>
                Connect Stripe Express
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-offwhite/30">Wildcard subdomain, Stripe Connect, and live social verification will unlock the final production flow.</div>
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-sm text-offwhite/60 mb-2">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary placeholder:text-offwhite/35"
      />
    </div>
  );
}
