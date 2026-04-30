'use client';

import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminSettings() {
  return (
    <AdminShell>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Settings</h1>
            <p className="text-offwhite/40">Organisation and approval defaults.</p>
          </div>
          <Button variant="premium">Save</Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div>
            <div className="text-sm text-offwhite/60 mb-2">Default commission %</div>
            <input
              defaultValue="12"
              className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <div className="text-sm text-offwhite/60 mb-2">Approval mode</div>
            <select className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary">
              <option>Manual approval</option>
              <option>Auto-approve Established + Headline</option>
              <option>Auto-approve all creators</option>
            </select>
          </div>
          <div className="rounded-xl border border-white/10 bg-dark p-5">
            <div className="text-white font-bold">Integrations</div>
            <div className="text-sm text-offwhite/50 mt-1">
              Ticketing provider API connection planned. Production tracking service planned.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

