'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  unread?: boolean;
};

const creatorItems: NotificationItem[] = [
  {
    id: 'campaign-ready',
    title: 'Campaign links ready',
    detail: 'Your latest tracked links are ready to share.',
    href: '/app/builder?step=launch&campaign=default-campaign',
    unread: true,
  },
  {
    id: 'payout-window',
    title: 'Payout window',
    detail: 'Commissions clear after the refund window.',
    href: '/app/earnings',
  },
];

export function NotificationBell({ scope }: { scope: 'creator' | 'admin' }) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(scope === 'creator' ? creatorItems : []);
  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);
  const readStorageKey = `stagepass_${scope}_read_notifications_v1`;

  function applyReadState(nextItems: NotificationItem[]) {
    try {
      const readIds = JSON.parse(window.localStorage.getItem(readStorageKey) ?? '[]') as string[];
      return nextItems.map((item) => ({ ...item, unread: item.unread && !readIds.includes(item.id) }));
    } catch {
      return nextItems;
    }
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    try {
      const readIds = JSON.parse(window.localStorage.getItem(readStorageKey) ?? '[]') as string[];
      window.localStorage.setItem(readStorageKey, JSON.stringify(Array.from(new Set([...readIds, id]))));
    } catch {}
  }

  function markAllRead() {
    setItems((prev) => {
      try {
        window.localStorage.setItem(readStorageKey, JSON.stringify(prev.map((item) => item.id)));
      } catch {}
      return prev.map((item) => ({ ...item, unread: false }));
    });
  }

  useEffect(() => {
    if (scope !== 'creator') return;
    setItems(applyReadState(creatorItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  useEffect(() => {
    if (scope !== 'admin') return;
    let active = true;

    fetch('/api/admin/notifications', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json: { items?: NotificationItem[] }) => {
        if (active) setItems(applyReadState(json.items ?? []));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, pathname]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div ref={panelRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-offwhite/60 hover:text-white"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-2xl">
          <div className="border-b border-white/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">Notifications</div>
                <div className="text-xs text-offwhite/45">
                  {unreadCount > 0 ? `${unreadCount} item${unreadCount === 1 ? '' : 's'} need attention` : 'All caught up'}
                </div>
              </div>
              {unreadCount > 0 ? (
                <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80" onClick={markAllRead}>
                  Mark read
                </button>
              ) : null}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-offwhite/50">No notifications yet.</div>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    markRead(item.id);
                    setOpen(false);
                  }}
                  className="block border-b border-white/5 p-4 hover:bg-white/5"
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2 w-2 rounded-full ${item.unread ? 'bg-primary' : 'bg-white/20'}`} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-offwhite/50">{item.detail}</span>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
