'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart2, 
  Link as LinkIcon, 
  Wallet, 
  User,
  Search,
  Bell,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', href: '/app/marketplace', icon: ShoppingBag },
    { name: 'My Campaigns', href: '/app/campaigns', icon: BarChart2 },
    { name: 'Link Builder', href: '/app/builder', icon: LinkIcon },
    { name: 'Earnings', href: '/app/earnings', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-dark text-white bg-[radial-gradient(circle_at_8%_0%,rgba(83,74,183,0.22),transparent_34%),radial-gradient(circle_at_88%_100%,rgba(83,74,183,0.16),transparent_40%)]">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-dark/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Stagepass</span>
          </Link>
          
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-offwhite/40" />
            <Input
              type="text" 
              placeholder="Search campaigns..." 
              className="h-9 rounded-lg pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-offwhite/40 uppercase tracking-widest">Available Balance</span>
            <span className="text-sm font-bold text-accent-green">$4,250.00</span>
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <Button variant="ghost" size="icon" className="text-offwhite/60 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Link href="/app/profile">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-primary" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="page-shell py-10 page-fade-in">
        <div className="mb-8 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg w-fit text-primary text-xs font-bold uppercase tracking-widest">
          <Info className="w-3.5 h-3.5" />
          Prototype Mode
        </div>

        <nav className="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit overflow-x-auto no-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive 
                  ? "bg-dark text-white shadow-sm" 
                  : "text-offwhite/40 hover:text-offwhite/80"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-current")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
