'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { creators } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type PromoterRequest = {
  requestId: string;
  userId: string;
  email: string;
  displayName: string;
  orgName: string;
  status: string;
  requestedAt: string;
};

const creatorRowsStorageKey = 'stagepass_admin_creators_v1';
type CreatorRow = (typeof creators)[number] & { approval: 'Pending' | 'Approved' | 'Rejected' };

function loadCreatorRows(): CreatorRow[] {
  if (typeof window === 'undefined') return creators.map((c) => ({ ...c, approval: 'Pending' as const }));
  try {
    const saved = JSON.parse(window.localStorage.getItem(creatorRowsStorageKey) ?? '{}') as Record<string, Partial<CreatorRow>>;
    return creators.map((c) => ({
      ...c,
      approval: saved[c.id]?.approval ?? 'Pending',
      tier: saved[c.id]?.tier ?? c.tier,
    }));
  } catch {
    return creators.map((c) => ({ ...c, approval: 'Pending' as const }));
  }
}

function saveCreatorRows(rows: CreatorRow[]) {
  const payload = Object.fromEntries(rows.map((row) => [row.id, { approval: row.approval, tier: row.tier }]));
  window.localStorage.setItem(creatorRowsStorageKey, JSON.stringify(payload));
}

export default function AdminCreators() {
  const [rows, setRows] = useState<CreatorRow[]>(() => creators.map((c) => ({ ...c, approval: 'Pending' as const })));
  const [approvalsReady, setApprovalsReady] = useState(false);
  const [promoterRequests, setPromoterRequests] = useState<PromoterRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  async function loadPromoterRequests() {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/admin/promoter-requests', { cache: 'no-store' });
      const json = (await res.json()) as { items?: PromoterRequest[] };
      setPromoterRequests(json.items ?? []);
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    setRows(loadCreatorRows());
    setApprovalsReady(true);
    loadPromoterRequests();
  }, []);

  async function decidePromoterRequest(requestId: string, decision: 'approve' | 'reject') {
    await fetch('/api/admin/promoter-requests', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestId, decision }),
    });
    await loadPromoterRequests();
  }

  function setApproval(id: string, approval: 'Approved' | 'Rejected') {
    setRows((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, approval } : c));
      saveCreatorRows(next);
      return next;
    });
  }

  function setTier(id: string, tier: 'Default' | 'Established' | 'Headline') {
    setRows((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, tier } : c));
      saveCreatorRows(next);
      return next;
    });
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Creators</h1>
          <p className="text-offwhite/40">Approve creators, assign tiers, and review creator performance.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Promoter access activity</h2>
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5" onClick={loadPromoterRequests}>
              Refresh
            </Button>
          </div>
          {loadingRequests ? (
            <div className="text-sm text-offwhite/50">Loading requests...</div>
          ) : promoterRequests.length === 0 ? (
            <div className="text-sm text-offwhite/50">No promoter requests or onboarding activity yet.</div>
          ) : (
            <div className="space-y-3">
              {promoterRequests.map((r) => (
                <div key={r.requestId} className="rounded-xl border border-white/10 bg-dark/60 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{r.displayName || 'Promoter Applicant'}</div>
                      <div className="text-xs text-offwhite/45">{r.email}</div>
                      <div className="text-sm text-offwhite/75 mt-1">Org: {r.orgName || '-'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide text-offwhite/45 mr-1">{r.status}</span>
                      {r.status === 'PENDING' && (
                        <>
                          <Button variant="outline" className="h-8 text-white border-white/10 hover:bg-white/5" onClick={() => decidePromoterRequest(r.requestId, 'reject')}>
                            Reject
                          </Button>
                          <Button variant="premium" className="h-8" onClick={() => decidePromoterRequest(r.requestId, 'approve')}>
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:hidden space-y-3">
          {!approvalsReady ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-offwhite/50">
              Loading creator approvals...
            </div>
          ) : rows.map((c) => (
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
              {!approvalsReady ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-offwhite/50">
                    Loading creator approvals...
                  </TableCell>
                </TableRow>
              ) : rows.map((c) => (
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
