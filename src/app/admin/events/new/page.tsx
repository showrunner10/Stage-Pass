'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminEventSetup() {
  const [status, setStatus] = useState<'Draft' | 'Live'>('Draft');

  return (
    <AdminShell>
      <div className="max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Create Event</h1>
            <p className="text-offwhite/40">Multi-section setup for a polished prototype flow.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-white border-white/10 hover:bg-white/5"
              onClick={() => setStatus('Draft')}
            >
              Save as draft
            </Button>
            <Button variant="premium" onClick={() => setStatus('Live')}>
              Publish
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Status</div>
          <div className="text-white font-semibold">{status}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-8">
          <Section title="Event basics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Event title" placeholder="e.g. Solstice Festival 2026" />
              <Field label="Date" placeholder="e.g. Dec 20–22, 2026" />
              <Field label="Venue" placeholder="e.g. North Byron Parklands" />
              <Field label="City" placeholder="e.g. Byron Bay" />
            </div>
          </Section>

          <Section title="Ticketing provider">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-offwhite/60 mb-2">Provider</div>
                <select className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary">
                  <option>Tixr</option>
                  <option>Moshtix</option>
                  <option>Humanitix</option>
                  <option>Manual CSV</option>
                </select>
              </div>
              <Field label="Ticketing URL" placeholder="https://ticketing-partner.com/event/..." />
            </div>
            <div className="mt-4 text-xs text-offwhite/40">Tixr API connection planned.</div>
          </Section>

          <Section title="Ticket tiers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Tier name" placeholder="GA Weekend" />
              <Field label="Price (AUD)" placeholder="349" />
              <Field label="Tier description" placeholder="3-day access to all stages" />
            </div>
            <div className="mt-3">
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                Add another tier
              </Button>
            </div>
          </Section>

          <Section title="Commission & inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Default commission %" placeholder="12" />
              <Field label="Inventory cap %" placeholder="40" />
            </div>
          </Section>

          <Section title="Brand assets">
            <div className="rounded-xl border border-white/10 bg-dark p-5">
              <div className="text-white font-semibold">Upload brand assets</div>
              <div className="text-sm text-offwhite/50 mt-1">Placeholder for logos, hero images, and copy packs.</div>
              <div className="mt-4">
                <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                  Upload files
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Approval rules">
            <div className="rounded-xl border border-white/10 bg-dark p-5">
              <div className="text-white font-semibold">Creator approvals</div>
              <div className="text-sm text-offwhite/50 mt-1">
                Placeholder for auto-approve tiers, niche requirements, and manual review.
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-offwhite/40 uppercase tracking-widest">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div>
      <div className="text-sm text-offwhite/60 mb-2">{label}</div>
      <input
        placeholder={placeholder}
        className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
      />
    </div>
  );
}

