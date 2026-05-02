'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

function navActive(pathname: string, key: string): boolean {
  if (key === 'marketplace') {
    return pathname === '/events' || pathname.startsWith('/events/');
  }
  if (key === 'creators') {
    return pathname === '/creators' || pathname.startsWith('/creators/');
  }
  if (key === 'promoters') {
    return pathname === '/promoters' || pathname.startsWith('/promoters/');
  }
  if (key === 'about') {
    return pathname === '/about';
  }
  if (key === 'contact') {
    return pathname === '/contact';
  }
  if (key === 'apply') {
    return pathname.startsWith('/apply');
  }
  return false;
}

type NavItemProps = { href: string; navKey: string; children: ReactNode };

function NavItem({ href, navKey, children }: NavItemProps) {
  const pathname = usePathname() ?? '';
  const active = navActive(pathname, navKey);
  return (
    <Link
      href={href}
      className={cn(
        'pb-1 text-sm font-medium border-b-2 transition-colors',
        active
          ? 'text-white border-primary'
          : 'text-offwhite/80 border-transparent hover:text-white hover:border-white/25',
      )}
    >
      {children}
    </Link>
  );
}

export function PublicNavbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="page-shell h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/assets/branding/logo-wordmark.svg"
            alt="Stagepass logo"
            width={248}
            height={64}
            sizes="248px"
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavItem href="/events" navKey="marketplace">
            Marketplace
          </NavItem>
          <NavItem href="/creators" navKey="creators">
            For Creators
          </NavItem>
          <NavItem href="/promoters" navKey="promoters">
            For Promoters
          </NavItem>
          <NavItem href="/about" navKey="about">
            About
          </NavItem>
          <NavItem href="/contact" navKey="contact">
            Contact
          </NavItem>
          <NavItem href="/apply/creator" navKey="apply">
            Apply
          </NavItem>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link href="/login?next=%2Fapp%2Fdashboard" className="hidden sm:block">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Creator Login
            </Button>
          </Link>
          <Link href="/login?next=%2Fadmin%2Fdashboard">
            <Button variant="premium">List Event</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-white" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
