'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { creators } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminCreators() {
  const [rows, setRows] = useState<Array<(typeof creators)[number] & { approval: 'Pending' | 'Approved' | 'Rejected' }>>(() =>
    creators.map((c) => ({ ...c, approval: 'Pending' as const }))
  );

  function setApproval(id: string, approval: 'Approved' | 'Rejected') {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, approval } : c)));
  }

  function setTier(id: string, tier: 'Default' | 'Established' | 'Headline') {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, tier } : c)));
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Creators</h1>
          <p className="text-offwhite/40">Approve creators, assign tiers, and review performance mock data.</p>
        </div>

        <div className="lg:hidden space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-white font-semibold leading-tight">{c.name}</div>
                  <div className="text-xs text-offwhite/40">@{c.handle}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-offwhite/40">Fit</div>
                  <div className="text-accent-green font-semibold">{c.fitScore}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Niche</div>
                  <div className="text-offwhite/85 leading-tight">{c.niche}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-offwhite/40 mb-1">Audience</div>
                  <div className="text-offwhite/85">{c.audienceSize}</div>
                </div>
              </div>

              <select
                value={c.tier}
                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                onChange={(e) => setTier(c.id, e.target.value as 'Default' | 'Established' | 'Headline')}
              >
                <option>Default</option>
                <option>Established</option>
                <option>Headline</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                {c.approval === 'Pending' ? (
                  <>
                    <Button
                      variant="outline"
                      className="h-8 px-2 text-sm text-white border-white/10 hover:bg-white/5"
                      onClick={() => setApproval(c.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="premium"
                      className="h-8 px-2 text-sm"
                      onClick={() => setApproval(c.id, 'Approved')}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <div className={`col-span-2 text-sm font-semibold ${c.approval === 'Approved' ? 'text-accent-green' : 'text-offwhite/60'}`}>
                    {c.approval}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Niche</TableHead>
                <TableHead className="text-right">Audience</TableHead>
                <TableHead className="text-right">Fit score</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{c.name}</span>
                      <span className="text-xs text-offwhite/40">@{c.handle}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-offwhite/80">{c.niche}</TableCell>
                  <TableCell className="text-right text-offwhite/80">{c.audienceSize}</TableCell>
                  <TableCell className="text-right text-accent-green font-semibold">{c.fitScore}</TableCell>
                  <TableCell>
                    <select
                      value={c.tier}
                      className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                      onChange={(e) => setTier(c.id, e.target.value as 'Default' | 'Established' | 'Headline')}
                    >
                      <option>Default</option>
                      <option>Established</option>
                      <option>Headline</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.approval === 'Pending' ? (
                        <>
                          <Button
                            variant="outline"
                            className="h-9 px-3 text-white border-white/10 hover:bg-white/5"
                            onClick={() => setApproval(c.id, 'Rejected')}
                          >
                            Reject
                          </Button>
                          <Button variant="premium" className="h-9 px-3" onClick={() => setApproval(c.id, 'Approved')}>
                            Approve
                          </Button>
                        </>
                      ) : (
                        <div className={`text-sm font-semibold ${c.approval === 'Approved' ? 'text-accent-green' : 'text-offwhite/60'}`}>
                          {c.approval}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminShell>
  );
}
