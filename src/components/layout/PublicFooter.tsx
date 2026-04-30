import Link from 'next/link';
import Image from 'next/image';
import { Check, Facebook, Sparkles, Ticket, Twitter } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-dark border-t border-white/10 py-20">
      <div className="page-shell">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/branding/logo-wordmark.svg"
                alt="Stagepass logo"
                width={264}
                height={70}
                sizes="264px"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-offwhite/60 max-w-xs">
              The premium creator marketplace for live events. Earn from what you love going to.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">For Creators</h4>
            <ul className="space-y-4 text-offwhite/60">
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="/events" className="hover:text-primary transition-colors">Browse Events</Link></li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Creator Guide</Link></li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#pricing" className="hover:text-primary transition-colors">Earnings Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">For Promoters</h4>
            <ul className="space-y-4 text-offwhite/60">
              <li className="flex items-center gap-2"><Ticket className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="/admin/dashboard" className="hover:text-primary transition-colors">List your Event</Link></li>
              <li className="flex items-center gap-2"><Ticket className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Promoter Portal</Link></li>
              <li className="flex items-center gap-2"><Ticket className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Attribution Docs</Link></li>
              <li className="flex items-center gap-2"><Ticket className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4 text-offwhite/60">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary/80 shrink-0" /><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-5 justify-between">
            <div>
              <h4 className="text-xl font-bold text-white">Newsletter</h4>
              <p className="text-offwhite/55 text-sm mt-1">Weekly drops: new events, top campaigns, payout insights.</p>
            </div>
            <form className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="you@domain.com"
                className="h-11 min-w-[260px] w-full rounded-xl border border-white/15 bg-black/25 px-4 text-sm text-offwhite placeholder:text-offwhite/45 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-strong transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-offwhite/40 text-sm">© 2026 Stagepass. All rights reserved. Made in Australia.</p>
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="text-xs uppercase tracking-widest text-offwhite/45">Follow</span>
            <a
              href="https://www.facebook.com/stagepass/?fref=ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite/60 hover:text-primary transition-colors"
              aria-label="Stagepass on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/stagepasscom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite/60 hover:text-primary transition-colors"
              aria-label="Stagepass on X"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          <div className="flex gap-6 text-offwhite/40 text-sm">
            <span>Prototype v0.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
