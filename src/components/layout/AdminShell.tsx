'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Palette,
  Settings,
  ChevronDown,
  Info,
} from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const nav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Creators', href: '/admin/creators', icon: Users },
    { name: 'Payouts', href: '/admin/payouts', icon: Wallet },
    { name: 'Brand', href: '/admin/brand', icon: Palette },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="flex">
        <aside className="hidden lg:flex w-72 min-h-screen border-r border-white/10 bg-black/20 p-6 sticky top-0">
          <div className="w-full space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">Stagepass</span>
                <span className="text-xs text-offwhite/40 font-medium">Promoter Admin</span>
              </div>
            </Link>

            <nav className="space-y-1">
              {nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-white/5 text-white' : 'text-offwhite/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <item.icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-current')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-dark/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
                    S
                  </div>
                  <span className="text-xl font-bold tracking-tight">Stagepass</span>
                </Link>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm font-semibold">Secret Sounds</span>
                <ChevronDown className="w-4 h-4 text-offwhite/50" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Info className="w-3.5 h-3.5" />
                Prototype Mode
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10" />
            </div>
          </header>

          <main className="page-shell py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
