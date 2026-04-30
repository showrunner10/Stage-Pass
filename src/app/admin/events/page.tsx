'use client';

import { useMemo, useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { events } from '@/data/mock';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminEvents() {
  const [rows, setRows] = useState(() => events.slice());
  const byId = useMemo(() => new Map(rows.map((e) => [e.id, e])), [rows]);

  function togglePause(id: string) {
    const existing = byId.get(id);
    if (!existing) return;
    setRows((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.status === 'Live') return { ...e, status: 'Paused' };
        if (e.status === 'Paused') return { ...e, status: 'Live' };
        return e;
      })
    );
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Events</h1>
            <p className="text-offwhite/40">Create, publish, and manage commissions and inventory caps.</p>
          </div>
          <Button asChild variant="premium">
            <Link href="/admin/events/new">Create event</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Inventory cap</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{e.title}</span>
                      <span className="text-xs text-offwhite/40">
                        {e.city} · {e.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-offwhite/60">{e.status}</TableCell>
                  <TableCell className="text-right text-white font-semibold">{e.commission}%</TableCell>
                  <TableCell className="text-right text-offwhite/80">{e.inventoryCap.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-offwhite/80">{e.soldCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="h-9 px-3 text-white border-white/10 hover:bg-white/5"
                      >
                        <Link href={`/admin/events/new?edit=${encodeURIComponent(e.id)}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 px-3 text-offwhite/60 hover:text-white"
                        onClick={() => togglePause(e.id)}
                      >
                        {e.status === 'Paused' ? 'Resume' : 'Pause'}
                      </Button>
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
