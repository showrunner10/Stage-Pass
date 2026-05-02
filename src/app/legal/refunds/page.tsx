'use client';

import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicInteriorHero } from '@/components/layout/PublicInteriorHero';
import Link from 'next/link';

export default function RefundsPolicyPage() {
  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <PublicInteriorHero eyebrow="Legal" title="Refunds, chargebacks & commissions" narrow>
        <p className="text-offwhite/55 text-sm font-medium">Last updated: May 2026 · Stagepass marketplace</p>
      </PublicInteriorHero>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <div className="marketing-panel p-8 md:p-12 prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Ticketing &amp; refunds</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Ticket purchases are fulfilled by the event&apos;s ticketing partner (e.g. Tixr, Moshtix). Refund and consumer
                rights follow that partner&apos;s terms and Australian Consumer Law. Stagepass does not hold ticket inventory or
                process card payments for the underlying ticket in the MVP flow.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. Creator commissions</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Commissions are earned on attributed, confirmed orders as shown in your dashboard. Rates are set per event by
                the promoter and displayed before you publish a campaign. A platform take rate may apply on top of the creator
                commission as disclosed in your agreement and event brief.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. Clearance window</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Commission typically moves from <strong className="text-white">pending</strong> to{' '}
                <strong className="text-white">cleared</strong> after a refund/chargeback window (target: 14 days from purchase)
                so promoters and creators share predictable liability. Exact timings are shown in-product and may vary by
                integration.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Refunds &amp; clawbacks</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                If an order is refunded or charged back before commission clears, the pending commission is voided. If a refund
                occurs after payout, a clawback may be applied against future earnings. Disputes can be raised via{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  support
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. Contact</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Questions: <span className="text-primary">hello@stagepass.com.au</span>
              </p>
            </section>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
