'use client';

import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

const rows = [
  { id: 'p1', date: '2026-04-25', creator: 'Maya Rodriguez', amount: 1250, status: 'Paid' },
  { id: 'p2', date: '2026-04-18', creator: 'Sarah Jenkins', amount: 640, status: 'Processing' },
  { id: 'p3', date: '2026-04-12', creator: 'Alex Chen', amount: 320, status: 'Pending' },
];

function csvEscape(value: string | number) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminPayouts() {
  const [exported, setExported] = useState(false);

  function exportCsv() {
    const header = ['Date', 'Creator', 'Status', 'Amount AUD'];
    const lines = [
      header.map(csvEscape).join(','),
      ...rows.map((row) => [row.date, row.creator, row.status, row.amount.toFixed(2)].map(csvEscape).join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hypelist-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 2500);
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Payouts</h1>
            <p className="text-offwhite/40">Prototype view. Stripe Connect and payout engine planned for production.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="premium" onClick={exportCsv}>Export</Button>
            {exported ? <div className="text-xs text-accent-green">CSV exported</div> : null}
          </div>
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
