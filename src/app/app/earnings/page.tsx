'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { ledgerEntries } from '@/data/mock';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Earnings() {
  const available = 4250;
  const pending = 820;
  const cleared = 12500;

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Earnings</h1>
            <p className="text-offwhite/40">Track balances and payouts. Stripe Connect planned for production phase.</p>
          </div>
          <Button variant="premium">Connect Stripe Express</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Available</div>
            <div className="text-4xl font-black text-accent-green">{formatCurrency(available)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Pending</div>
            <div className="text-4xl font-black text-white">{formatCurrency(pending)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">Cleared (lifetime)</div>
            <div className="text-4xl font-black text-white">{formatCurrency(cleared)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Payout history</h2>
          <p className="text-sm text-offwhite/40 mb-6">Mock ledger for prototype.</p>

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

        <div className="text-xs text-offwhite/30">Stripe Connect integration planned for production phase.</div>
      </div>
    </DashboardShell>
  );
}
