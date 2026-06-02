'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > 520);
    }

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible || pathname?.startsWith('/app') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0f1118]/90 text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9),0_0_0_1px_rgba(37,99,255,0.16)] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary hover:shadow-[0_22px_44px_-18px_rgba(37,99,255,0.8)] focus:outline-none focus:ring-2 focus:ring-primary/70 md:bottom-8 md:right-8"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
