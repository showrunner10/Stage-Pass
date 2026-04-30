import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function PublicNavbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="page-shell h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <span className="text-2xl font-bold tracking-tight text-white">Stagepass</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/events" className="text-offwhite/80 hover:text-white transition-colors">Marketplace</Link>
          <Link href="/#how-it-works" className="text-offwhite/80 hover:text-white transition-colors">How it Works</Link>
          <Link href="/#pricing" className="text-offwhite/80 hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/app/dashboard" className="hidden sm:block">
            <Button variant="ghost" className="text-white hover:bg-white/10">Creator Login</Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="premium">List Event</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
