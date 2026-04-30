'use client';

import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminBrand() {
  return (
    <AdminShell>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Brand</h1>
            <p className="text-offwhite/40">Upload assets and define creator-ready promo kits.</p>
          </div>
          <Button variant="premium">Upload assets</Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="text-white font-bold">Asset library</div>
          <div className="text-sm text-offwhite/50">
            Placeholder for event hero images, logos, copy packs, and approved messaging.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-dark border border-white/10" />
            ))}
          </div>
        </div>

        <div className="text-xs text-offwhite/30">Production asset storage and permissions planned.</div>
      </div>
    </AdminShell>
  );
}

