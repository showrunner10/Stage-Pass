'use client';

import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicInteriorHero } from '@/components/layout/PublicInteriorHero';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <PublicInteriorHero eyebrow="Legal" title="Privacy Policy" narrow>
        <p className="text-offwhite/55 text-sm font-medium">Last updated: May 2026 · APP &amp; GDPR-aligned practices</p>
      </PublicInteriorHero>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <div className="marketing-panel p-8 md:p-12 prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                StagePass ("we," "us," "our," or "Company") operates the stagepass.com.au website and related services (the "Service"). This Privacy Policy explains our data practices and your rights.
              </p>
              <p className="text-[#aaaaaa] leading-relaxed mt-4">
                By accessing or using StagePass, you agree to this Privacy Policy. If you do not agree, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-bold text-white mb-3">2.1 Personal Information</h3>
              <p className="text-[#aaaaaa] leading-relaxed">We collect personal information you provide directly, such as:</p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Name, email address, phone number</li>
                <li>Account credentials and profile information</li>
                <li>Payment information (processed securely by third parties)</li>
                <li>Creator/Promoter specific data (audience size, event details, commission preferences)</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2.2 Usage Data</h3>
              <p className="text-[#aaaaaa] leading-relaxed">We automatically collect:</p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Device information (IP address, browser, device type)</li>
                <li>Pages visited, time spent, clickstream data</li>
                <li>Campaign performance metrics</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. How We Use Your Data</h2>
              <p className="text-[#aaaaaa] leading-relaxed">We use information to:</p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Provide and maintain the Service</li>
                <li>Process payments and commissions</li>
                <li>Personalize your experience</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and enhance security</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Data Sharing</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                We do not sell your personal data. We may share information with:
              </p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Service providers (payment processors, hosting, analytics)</li>
                <li>Event promoters and creators (as necessary for campaigns)</li>
                <li>Law enforcement (when legally required)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="text-[#aaaaaa] leading-relaxed">Under Australian Privacy Act and GDPR, you have the right to:</p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Access your personal information</li>
                <li>Request corrections or deletions</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability (export your data)</li>
              </ul>
              <p className="text-[#aaaaaa] leading-relaxed mt-4">
                Contact us at <span className="text-primary">privacy@stagepass.com.au</span> to exercise these rights.
              </p>
              <h3 className="text-xl font-bold text-white mb-3 mt-8">Data deletion requests</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                To request deletion of your personal information (subject to legal and accounting retention requirements), email{' '}
                <span className="text-primary">privacy@stagepass.com.au</span> with the subject line &quot;Data deletion request&quot;
                and the email address on your account. We respond within applicable Australian Privacy Principles and GDPR timelines.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">6. Security</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">7. Contact Us</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                For privacy questions, contact: <span className="text-primary">privacy@stagepass.com.au</span>
              </p>
            </section>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
