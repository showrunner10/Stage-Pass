'use client';

import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />

      <section className="py-20 md:py-28">
        <div className="page-shell max-w-3xl">
          <h1 className="text-5xl font-black text-white mb-4">Terms & Conditions</h1>
          <p className="text-[#aaaaaa] mb-10">Last updated: May 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                By accessing and using StagePass (stagepass.com.au), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. Account Registration</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                To access certain features, you must create an account and provide accurate, complete information. You are responsible for maintaining confidentiality of your account and password.
              </p>
              <p className="text-[#aaaaaa] leading-relaxed mt-4">
                You agree not to: Create false accounts, impersonate others, or provide false information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. Creator Terms</h2>
              <h3 className="text-xl font-bold text-white mb-3">3.1 Campaign Promotion</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Creators agree to promote events in compliance with applicable advertising standards and may not engage in deceptive practices.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">3.2 Commission Structure</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Commissions are based on the tier system displayed at account creation and are subject to change with 30 days' notice.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">3.3 Payout Terms</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Verified commissions are paid within 2–7 business days to the bank account specified. Refunds and chargebacks may delay or reverse payouts.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Promoter/Organizer Terms</h2>
              <h3 className="text-xl font-bold text-white mb-3">4.1 Event Listing</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Event organizers confirm they have the right to list events and that all event information is accurate and lawful.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">4.2 Inventory Management</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Promoters are responsible for accurate ticket inventory and must prevent overselling.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">4.3 Commission Payment</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Promoters agree to pay commissions as specified in the commission schedule. Failure to pay may result in account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. User Conduct</h2>
              <p className="text-[#aaaaaa] leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Violate any law or regulation</li>
                <li>Engage in fraud, manipulation, or deception</li>
                <li>Abuse or harass other users</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Use automated tools to scrape data</li>
                <li>Infringe intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                All content on StagePass (text, graphics, logos, images, code) is owned by or licensed to StagePass and protected by copyright laws.
              </p>
              <p className="text-[#aaaaaa] leading-relaxed mt-4">
                You retain ownership of content you create (campaigns, creative assets) and grant StagePass a license to display and distribute it on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                StagePass is provided "as is" without warranty. We are not liable for indirect, incidental, or consequential damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">8. Dispute Resolution</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Disputes shall be governed by the laws of New South Wales, Australia. Both parties agree to attempt resolution through good faith negotiation before pursuing legal action.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">9. Changes to Terms</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                We may update these terms at any time. Continued use of the Service constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">10. Contact</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                For questions about these Terms, contact: <span className="text-primary">legal@stagepass.com.au</span>
              </p>
            </section>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
