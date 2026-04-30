'use client';

import { useMemo, useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { events, creators } from '@/data/mock';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  const totalSales = 642_250;
  const commissionPayable = 38_420;
  const activeCreators = 34;
  const conversionRate = 5.7;

  const [pendingApprovals, setPendingApprovals] = useState<Array<(typeof creators)[number] & { decision: 'Pending' | 'Approved' | 'Rejected' }>>(() =>
    creators.slice(0, 3).map((c) => ({ ...c, decision: 'Pending' as const }))
  );
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [auditLog, setAuditLog] = useState<Array<{ id: string; action: string; at: string }>>([]);

  const topCreators = creators
    .slice()
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);

  const performance = useMemo(() => {
    return events.slice(0, 4).map((e) => {
      const pct = Math.round((e.soldCount / e.inventoryCap) * 100);
      return { ...e, pct };
    });
  }, []);

  function pushAudit(action: string) {
    setAuditLog((prev) => [{ id: `${Date.now()}-${Math.random()}`, action, at: new Date().toLocaleString() }, ...prev].slice(0, 10));
  }

  function setDecision(id: string, decision: 'Approved' | 'Rejected') {
    setPendingApprovals((prev) => prev.map((c) => (c.id === id ? { ...c, decision } : c)));
    pushAudit(`${decision} creator ${id}`);
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelectedCreatorIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  }

  function bulkDecision(decision: 'Approved' | 'Rejected') {
    if (selectedCreatorIds.length === 0) return;
    setPendingApprovals((prev) => prev.map((c) => (selectedCreatorIds.includes(c.id) ? { ...c, decision } : c)));
    pushAudit(`Bulk ${decision.toLowerCase()} ${selectedCreatorIds.length} creators`);
    setSelectedCreatorIds([]);
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
            <p className="text-offwhite/40">Promoter performance and creator attribution overview.</p>
          </div>
          <Button asChild variant="premium">
            <Link href="/admin/events/new">Create event</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title="Total sales" value={formatCurrency(totalSales)} />
          <Stat title="Commission payable" value={formatCurrency(commissionPayable)} accent />
          <Stat title="Active creators" value={activeCreators.toString()} />
          <Stat title="Conversion rate" value={`${conversionRate}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Event performance</h2>
            <p className="text-sm text-offwhite/40 mb-6">Inventory cap visualisation (mock)</p>

            <div className="space-y-4">
              {performance.map((e) => (
                <div key={e.id} className="rounded-xl bg-dark border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">{e.title}</div>
                      <div className="text-xs text-offwhite/40">{e.city} · {e.date}</div>
                    </div>
                    <div className="text-sm text-offwhite/60">
                      {e.soldCount.toLocaleString()} / {e.inventoryCap.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, e.pct)}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-offwhite/40">{e.pct}% sold</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold text-white mb-2">Pending creator approvals</h2>
              <p className="text-sm text-offwhite/40 mb-4">Approve creators based on fit score and tier.</p>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" className="h-8 px-3 text-white border-white/10 hover:bg-white/5" onClick={() => bulkDecision('Rejected')}>
                  Reject selected
                </Button>
                <Button variant="premium" className="h-8 px-3" onClick={() => bulkDecision('Approved')}>
                  Approve selected
                </Button>
              </div>
              <div className="space-y-4">
                {pendingApprovals.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex items-start gap-3">
                      <input type="checkbox" className="mt-1 accent-primary" checked={selectedCreatorIds.includes(c.id)} onChange={(e) => toggleSelect(c.id, e.target.checked)} />
                      <div>
                        <div className="text-white font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-offwhite/40">{c.niche} · {c.audienceSize} · Fit {c.fitScore}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.decision === 'Pending' ? (
                        <>
                          <Button variant="outline" className="h-9 px-3 text-white border-white/10 hover:bg-white/5" onClick={() => setDecision(c.id, 'Rejected')}>
                            Reject
                          </Button>
                          <Button variant="premium" className="h-9 px-3" onClick={() => setDecision(c.id, 'Approved')}>
                            Approve
                          </Button>
                        </>
                      ) : (
                        <div className={`text-sm font-semibold ${c.decision === 'Approved' ? 'text-accent-green' : 'text-offwhite/60'}`}>{c.decision}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Top creators</h2>
                  <p className="text-sm text-offwhite/40">Mock ranking</p>
                </div>
                <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
                  <Link href="/admin/creators">Manage</Link>
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead className="text-right">Fit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCreators.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{c.name}</span>
                          <span className="text-xs text-offwhite/40">{c.niche}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-accent-green font-semibold">{c.fitScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold text-white mb-2">Audit log</h2>
              <p className="text-sm text-offwhite/40 mb-5">Every admin action is timestamped.</p>
              <div className="space-y-3">
                {auditLog.length === 0 ? (
                  <div className="text-sm text-offwhite/50">No recent actions yet.</div>
                ) : (
                  auditLog.map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <div className="text-sm text-white">{entry.action}</div>
                      <div className="text-xs text-offwhite/45 mt-1">{entry.at}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-offwhite/30">Production tracking service planned. Ticketing provider API connection planned.</div>
      </div>
    </AdminShell>
  );
}

function Stat({ title, value, accent }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">{title}</div>
      <div className={`text-3xl font-black ${accent ? 'text-accent-green' : 'text-white'}`}>{value}</div>
    </div>
  );
}
