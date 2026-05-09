'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

type TierRow = {
  name: string;
  price: string;
  description: string;
};

type EventFormState = {
  id?: string;
  title: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  city: string;
  ticketingProvider: 'TIXR' | 'MOSHTIX' | 'HUMANITIX' | 'MANUAL';
  ticketingUrl: string;
  commissionPct: string;
  inventoryCap: string;
  heroImageUrl: string;
  description: string;
  ticketTiers: TierRow[];
};

const emptyForm: EventFormState = {
  title: '',
  startsAt: '',
  endsAt: '',
  venue: '',
  city: '',
  ticketingProvider: 'TIXR',
  ticketingUrl: '',
  commissionPct: '12',
  inventoryCap: '0',
  heroImageUrl: '',
  description: '',
  ticketTiers: [{ name: '', price: '', description: '' }],
};

function AdminEventSetupContent() {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get('edit');
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [loading, setLoading] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!editId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/events/${editId}`, { cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as { item?: Partial<EventFormState>; error?: string };
        if (!active) return;
        if (!res.ok || !json.item) {
          setError(json.error ?? 'Could not load event.');
          return;
        }
        setForm({
          ...emptyForm,
          ...json.item,
          commissionPct: String(json.item.commissionPct ?? '12'),
          inventoryCap: String(json.item.inventoryCap ?? '0'),
          ticketTiers:
            json.item.ticketTiers?.map((tier) => ({
              name: tier.name ?? '',
              price: String(tier.price ?? ''),
              description: tier.description ?? '',
            })) ?? emptyForm.ticketTiers,
        });
      } catch {
        if (active) setError('Could not load event.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [editId]);

  const pageTitle = useMemo(() => (editId ? 'Edit Event' : 'Create Event'), [editId]);

  function update<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateTier(index: number, key: keyof TierRow, value: string) {
    setForm((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.map((tier, idx) => (idx === index ? { ...tier, [key]: value } : tier)),
    }));
  }

  function addTier() {
    setForm((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { name: '', price: '', description: '' }],
    }));
  }

  async function save(status: 'DRAFT' | 'LIVE') {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        ...form,
        status,
        ticketTiers: form.ticketTiers.filter((tier) => tier.name.trim() && tier.price.trim()),
      };
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; eventId?: string };
      if (!res.ok) {
        setError(json.error ?? 'Could not save event.');
        return;
      }
      setMessage(status === 'LIVE' ? 'Event published.' : 'Draft saved.');
      if (json.eventId) {
        router.push(`/admin/events/${json.eventId}`);
      }
    } catch {
      setError('Could not save event.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">{pageTitle}</h1>
            <p className="text-offwhite/40">Set event details, ticket tiers, and marketplace settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-white border-white/10 hover:bg-white/5"
              onClick={() => save('DRAFT')}
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : 'Save as draft'}
            </Button>
            <Button variant="premium" onClick={() => save('LIVE')} disabled={saving || loading}>
              {saving ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>

        {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div> : null}
        {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">{message}</div> : null}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-8">
          <Section title="Event basics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Event title" value={form.title} onChange={(value) => update('title', value)} placeholder="e.g. Solstice Festival 2026" />
              <Field label="Venue" value={form.venue} onChange={(value) => update('venue', value)} placeholder="e.g. North Byron Parklands" />
              <Field label="City" value={form.city} onChange={(value) => update('city', value)} placeholder="e.g. Byron Bay" />
              <Field label="Hero image URL" value={form.heroImageUrl} onChange={(value) => update('heroImageUrl', value)} placeholder="https://..." />
              <Field label="Starts at" type="datetime-local" value={form.startsAt} onChange={(value) => update('startsAt', value)} />
              <Field label="Ends at" type="datetime-local" value={form.endsAt} onChange={(value) => update('endsAt', value)} />
            </div>
            <div>
              <div className="text-sm text-offwhite/60 mb-2">Description</div>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary min-h-28"
              />
            </div>
          </Section>

          <Section title="Ticketing provider">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-offwhite/60 mb-2">Provider</div>
                <select
                  value={form.ticketingProvider}
                  onChange={(e) => update('ticketingProvider', e.target.value as EventFormState['ticketingProvider'])}
                  className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="TIXR">Tixr</option>
                  <option value="MOSHTIX">Moshtix</option>
                  <option value="HUMANITIX">Humanitix</option>
                  <option value="MANUAL">Manual CSV</option>
                </select>
              </div>
              <Field label="Ticketing URL" value={form.ticketingUrl} onChange={(value) => update('ticketingUrl', value)} placeholder="https://ticketing-partner.com/event/..." />
            </div>
          </Section>

          <Section title="Ticket tiers">
            <div className="space-y-4">
              {form.ticketTiers.map((tier, index) => (
                <div key={`${index}-${tier.name}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Tier name" value={tier.name} onChange={(value) => updateTier(index, 'name', value)} placeholder="GA Weekend" />
                  <Field label="Price (AUD)" value={tier.price} onChange={(value) => updateTier(index, 'price', value)} placeholder="349" />
                  <Field label="Tier description" value={tier.description} onChange={(value) => updateTier(index, 'description', value)} placeholder="3-day access to all stages" />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5" onClick={addTier}>
                Add another tier
              </Button>
            </div>
          </Section>

          <Section title="Commission & inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Default commission %" value={form.commissionPct} onChange={(value) => update('commissionPct', value)} placeholder="12" />
              <Field label="Inventory cap" value={form.inventoryCap} onChange={(value) => update('inventoryCap', value)} placeholder="5000" />
            </div>
          </Section>
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminEventSetup() {
  return (
    <Suspense
      fallback={
        <AdminShell>
          <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 loading-shimmer">Loading event form...</div>
        </AdminShell>
      }
    >
      <AdminEventSetupContent />
    </Suspense>
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-sm text-offwhite/60 mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
      />
    </div>
  );
}
