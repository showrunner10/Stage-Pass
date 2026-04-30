'use client';

import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export default function AdminPayouts() {
  const rows = [
    { id: 'p1', date: '2026-04-25', creator: 'Maya Rodriguez', amount: 1250, status: 'Paid' },
    { id: 'p2', date: '2026-04-18', creator: 'Sarah Jenkins', amount: 640, status: 'Processing' },
    { id: 'p3', date: '2026-04-12', creator: 'Alex Chen', amount: 320, status: 'Pending' },
  ];

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Payouts</h1>
            <p className="text-offwhite/40">Prototype view. Stripe Connect and payout engine planned for production.</p>
          </div>
          <Button variant="premium">Export</Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell className="text-white font-medium">{r.creator}</TableCell>
                  <TableCell className="text-offwhite/60">{r.status}</TableCell>
                  <TableCell className="text-right text-accent-green font-semibold">{formatCurrency(r.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-xs text-offwhite/30">
          Stripe Connect planned. Automated payout scheduling and reconciliation planned.
        </div>
      </div>
    </AdminShell>
  );
}

