'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Download, Upload, Key, Bell, Plug, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SettingsPayload = {
  displayName: string;
  email: string;
  bio: string;
  instagramHandle: string;
  tiktokHandle: string;
  audience: string;
  notifications: Record<string, boolean>;
  bankData: {
    accountName: string;
    bsb: string;
    accountNumber: string;
  };
};

const emptySettings: SettingsPayload = {
  displayName: '',
  email: '',
  bio: '',
  instagramHandle: '',
  tiktokHandle: '',
  audience: '',
  notifications: {},
  bankData: {
    accountName: '',
    bsb: '',
    accountNumber: '',
  },
};

export default function CreatorSettingsPage() {
  const [settings, setSettings] = useState<SettingsPayload>(emptySettings);
  const [initialSettings, setInitialSettings] = useState<SettingsPayload>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/app/settings', { cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as { item?: SettingsPayload; error?: string };
        if (!active) return;
        if (!res.ok || !json.item) {
          setError(json.error ?? 'Could not load settings.');
          return;
        }
        setSettings(json.item);
        setInitialSettings(json.item);
      } catch {
        if (active) setError('Could not load settings.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(initialSettings), [settings, initialSettings]);

  function updateField<K extends keyof SettingsPayload>(key: K, value: SettingsPayload[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateBankField<K extends keyof SettingsPayload['bankData']>(key: K, value: string) {
    setSettings((prev) => ({ ...prev, bankData: { ...prev.bankData, [key]: value } }));
  }

  function toggleNotification(label: string, enabled: boolean) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [label]: enabled },
    }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/app/settings', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Could not save settings.');
        return;
      }
      setInitialSettings(settings);
      setMessage('Settings saved.');
    } catch {
      setError('Could not save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl space-y-10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
          <p className="text-[#aaaaaa]">Manage your profile, payment method, and preferences</p>
        </div>

        {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div> : null}
        {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">{message}</div> : null}

        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Display Name" value={settings.displayName} onChange={(value) => updateField('displayName', value)} />
              <Field label="Email Address" value={settings.email} disabled onChange={() => {}} />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Instagram Handle" value={settings.instagramHandle} onChange={(value) => updateField('instagramHandle', value)} />
              <Field label="TikTok Handle" value={settings.tiktokHandle} onChange={(value) => updateField('tiktokHandle', value)} />
              <Field label="Audience" value={settings.audience} onChange={(value) => updateField('audience', value)} />
            </div>

            <div className="flex gap-4">
              <Button variant="premium" className="h-12 px-8" disabled={saving || loading || !dirty} onClick={save}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                className="h-12 px-8 text-white border-white/30 hover:bg-white/10"
                disabled={!dirty}
                onClick={() => {
                  setSettings(initialSettings);
                  setError(null);
                  setMessage(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-white/5 border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6" /> Payment Method
            </h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-4">Bank Account</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Account Name" value={settings.bankData.accountName} onChange={(value) => updateBankField('accountName', value)} />
                <Field label="BSB" value={settings.bankData.bsb} onChange={(value) => updateBankField('bsb', value)} />
                <Field label="Account Number" value={settings.bankData.accountNumber} onChange={(value) => updateBankField('accountNumber', value)} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Plug className="w-6 h-6" /> Integrations
          </h2>
          <p className="text-sm text-offwhite/45 mb-6">Connect tools for social verification, email, and ticketing (Phase 2+).</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              Instagram Graph (coming soon)
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              TikTok Display API (coming soon)
            </Button>
          </div>
        </Card>

        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications &amp; email
          </h2>
          <p className="text-sm text-offwhite/45 mb-6">Control product and marketing email separately (Spam Act opt-in).</p>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([label, enabled]) => (
              <label key={label} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => toggleNotification(label, e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-white">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Key className="w-6 h-6" /> Security
          </h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" asChild>
              <Link href="/login">Change Password</Link>
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              View Login Activity
            </Button>
          </div>
        </Card>

        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Data, privacy &amp; cookies</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2" disabled>
              <Download className="w-5 h-5" /> Download My Data
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2" disabled>
              <Upload className="w-5 h-5" /> Export Campaign History
            </Button>
            <Link href="/legal/cookies" className="block">
              <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2">
                <Cookie className="w-5 h-5" /> Cookie &amp; tracking preferences
              </Button>
            </Link>
            <Link href="/legal/privacy" className="block text-sm text-primary hover:underline px-1">
              Privacy policy &amp; data deletion requests →
            </Link>
          </div>
        </Card>

        <Card className="p-8 bg-red-950/20 border-red-900/30">
          <h2 className="text-2xl font-bold text-white mb-3">Danger Zone</h2>
          <p className="text-[#aaaaaa] mb-6">
            Delete your account and all associated data. This action is permanent and cannot be undone.
          </p>
          <Button variant="outline" className="h-12 text-red-400 border-red-900/50 hover:bg-red-950/30" disabled>
            Delete Account
          </Button>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors disabled:text-white/50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
