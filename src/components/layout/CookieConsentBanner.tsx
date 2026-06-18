'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const STORAGE_KEY = 'hypelist_cookie_consent_v1';

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/app') || pathname.startsWith('/admin')) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [pathname]);

  if (!visible || pathname?.startsWith('/app') || pathname?.startsWith('/admin')) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none"
    >
      <div className="page-shell max-w-4xl mx-auto pointer-events-auto rounded-2xl border border-white/15 bg-[#0f1118]/95 backdrop-blur-md shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-sm text-offwhite/80 leading-relaxed">
          <p className="font-semibold text-white mb-1">Cookies & privacy</p>
          We use necessary cookies to run the site and optional analytics to improve the product. See our{' '}
          <Link href="/legal/cookies" className="text-primary hover:underline">
            Cookie Policy
          </Link>
          ,{' '}
          <Link href="/legal/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          , and{' '}
          <Link href="/legal/refunds" className="text-primary hover:underline">
            Refunds &amp; commissions
          </Link>
          . Australian Privacy Principles and GDPR-style rights are described in Privacy.
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={accept}
            className="h-11 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-strong transition-colors"
          >
            Accept essential
          </button>
          <Link
            href="/legal/cookies"
            className="h-11 px-6 rounded-xl border border-white/20 text-white font-semibold text-sm flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
