'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Palette,
  Settings,
  ChevronDown,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Creators', href: '/admin/creators', icon: Users },
    { name: 'Payouts', href: '/admin/payouts', icon: Wallet },
    { name: 'Brand', href: '/admin/brand', icon: Palette },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="flex">
        <aside className="hidden lg:flex w-72 min-h-screen border-r border-white/10 bg-black/20 p-6 sticky top-0">
          <div className="w-full space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/branding/logo-wordmark.svg"
                alt="Stagepass logo"
                width={192}
                height={50}
                sizes="192px"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
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
                <Link href="/" className="flex items-center">
                  <Image
                    src="/assets/branding/logo-wordmark.svg"
                    alt="Stagepass logo"
                    width={180}
                    height={48}
                    sizes="180px"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm font-semibold">Secret Sounds</span>
                <ChevronDown className="w-4 h-4 text-offwhite/50" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-offwhite/40 uppercase tracking-widest">Admin</span>
                <span className="text-sm font-semibold text-white">Secret Sounds</span>
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden"
                aria-label="Admin profile"
              >
                <User className="w-5 h-5 text-primary" />
              </button>
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 h-9" onClick={logout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="page-shell py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
