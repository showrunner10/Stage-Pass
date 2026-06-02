'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';

type AdminSettingsState = {
  commissionPct: string;
  approvalMode: string;
};

const settingsStorageKey = 'stagepass_admin_settings_v1';
const defaultSettings: AdminSettingsState = {
  commissionPct: '12',
  approvalMode: 'Manual approval',
};

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(window.localStorage.getItem(settingsStorageKey) ?? '{}') } as AdminSettingsState;
  } catch {
    return defaultSettings;
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettingsState>(defaultSettings);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setReady(true);
  }, []);

  function update<K extends keyof AdminSettingsState>(key: K, value: AdminSettingsState[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    setMessage('Settings saved.');
    window.setTimeout(() => setMessage(null), 2200);
  }

  return (
    <AdminShell>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Settings</h1>
            <p className="text-offwhite/40">Organisation and approval defaults.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="premium" onClick={save} disabled={!ready}>Save</Button>
            {message ? <div className="text-xs text-accent-green">{message}</div> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div>
            <div className="text-sm text-offwhite/60 mb-2">Default commission %</div>
            <input
              value={settings.commissionPct}
              onChange={(event) => update('commissionPct', event.target.value)}
              className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <div className="text-sm text-offwhite/60 mb-2">Approval mode</div>
            <select
              value={settings.approvalMode}
              onChange={(event) => update('approvalMode', event.target.value)}
              className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
            >
              <option>Manual approval</option>
              <option>Auto-approve Established + Headline</option>
              <option>Auto-approve all creators</option>
            </select>
          </div>
          <div className="rounded-xl border border-white/10 bg-dark p-5 space-y-4">
            <div>
              <div className="text-white font-bold">Integrations</div>
              <div className="text-sm text-offwhite/50 mt-1">
                Requests and contact emails are sent to <span className="text-white">showrunner2026.io@gmail.com</span> when SMTP is configured.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <IntegrationStatus name="SMTP email" status="Env required" detail="SMTP_HOST, SMTP_USER, SMTP_PASS" />
              <IntegrationStatus name="Ticketing API" status="Planned" detail="Tixr/Moshtix/Humanitix" />
              <IntegrationStatus name="Stripe Connect" status="Planned" detail="Creator payout onboarding" />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function IntegrationStatus({ name, status, detail }: { name: string; status: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="text-sm font-semibold text-white">{name}</div>
      <div className="mt-2 text-xs font-bold text-primary">{status}</div>
      <div className="mt-1 text-xs text-offwhite/45">{detail}</div>
    </div>
  );
}
