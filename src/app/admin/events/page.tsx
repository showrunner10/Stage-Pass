import { AdminShell } from '@/components/layout/AdminShell';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAdminEvents } from '@/lib/server/admin-events';

export default async function AdminEvents() {
  const rows = await getAdminEvents();

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
              {rows.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{event.title}</span>
                      <span className="text-xs text-offwhite/40">
                        {event.city} · {event.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-offwhite/60">{event.status}</TableCell>
                  <TableCell className="text-right text-white font-semibold">{event.commission}%</TableCell>
                  <TableCell className="text-right text-offwhite/80">{event.inventoryCap.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-offwhite/80">{event.soldCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" className="h-9 px-3 text-white border-white/10 hover:bg-white/5">
                        <Link href={`/admin/events/${event.id}`}>View</Link>
                      </Button>
                      <Button asChild variant="ghost" className="h-9 px-3 text-offwhite/60 hover:text-white">
                        <Link href={`/admin/events/new?edit=${encodeURIComponent(event.id)}`}>Edit</Link>
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
