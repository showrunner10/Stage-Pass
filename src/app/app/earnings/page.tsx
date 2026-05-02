'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { ledgerEntries } from '@/data/mock';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Earnings() {
  const available = 4250;
  const pending = 820;
  const cleared = 8900;
  const paid = 12500;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Earnings</h1>
            <p className="text-offwhite/40 text-sm mt-1">
              Balances, ledger, and payouts. Stripe Connect Express is required for withdrawals (production).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="premium">Withdraw</Button>
            <Link href="/app/profile">
              <Button variant="outline" className="text-white border-white/15 hover:bg-white/5">
                Payout settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-1">Stripe Connect</div>
            <p className="text-white font-semibold">Not connected (prototype)</p>
            <p className="text-sm text-offwhite/45 mt-1">
              Complete Express onboarding to enable payouts and tax forms.
            </p>
          </div>
          <Badge className="bg-amber-500/15 text-amber-200 border-amber-500/30 w-fit">Action required</Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Available', value: available, hint: 'Ready to withdraw', tone: 'text-accent-green' },
            { label: 'Pending', value: pending, hint: 'In refund window', tone: 'text-white' },
            { label: 'Cleared', value: cleared, hint: 'Past clearance, not paid', tone: 'text-white' },
            { label: 'Paid (lifetime)', value: paid, hint: 'Transferred total', tone: 'text-offwhite/80' },
          ].map((b) => (
            <div key={b.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="text-[10px] sm:text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">{b.label}</div>
              <div className={`text-2xl sm:text-3xl font-black ${b.tone}`}>{formatCurrency(b.value)}</div>
              <div className="text-[11px] text-offwhite/40 mt-2">{b.hint}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-2">Auto-withdraw</h2>
          <p className="text-sm text-offwhite/45 mb-4">
            When balance exceeds threshold, schedule weekly payout (target: Sunday cycle per brief).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-offwhite/50 uppercase tracking-wider">Threshold (AUD)</label>
              <input
                type="number"
                defaultValue={50}
                className="mt-1 w-full max-w-xs h-11 rounded-xl bg-dark border border-white/10 px-3 text-white"
              />
            </div>
            <Button variant="outline" className="text-white border-white/15 h-11">
              Save preference
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Commission ledger</h2>
          <p className="text-sm text-offwhite/40 mb-6">Order-level commission rows (mock data).</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.date}</TableCell>
                  <TableCell className="text-white">{e.description}</TableCell>
                  <TableCell className="text-offwhite/60">{e.status}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      e.amount >= 0 ? 'text-accent-green' : 'text-offwhite/70'
                    }`}
                  >
                    {e.amount >= 0 ? formatCurrency(e.amount) : `-${formatCurrency(Math.abs(e.amount))}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Payout history</h2>
          <p className="text-sm text-offwhite/40 mb-4">Stripe transfer IDs appear here after production payout runs.</p>
          <div className="text-sm text-offwhite/50 rounded-xl border border-dashed border-white/10 p-8 text-center">
            No payouts yet — connect Stripe to enable withdrawals.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-2">Statements</h3>
            <p className="text-sm text-offwhite/45 mb-4">Monthly earnings statements (PDF) — coming with Stripe reporting.</p>
            <Button variant="outline" className="text-white border-white/15" disabled>
              Download
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-2">Tax documents</h3>
            <p className="text-sm text-offwhite/45 mb-4">AU tax summaries / Stripe-issued docs when applicable.</p>
            <Button variant="outline" className="text-white border-white/15" disabled>
              View documents
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
