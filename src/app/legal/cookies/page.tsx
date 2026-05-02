'use client';

import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicInteriorHero } from '@/components/layout/PublicInteriorHero';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <PublicInteriorHero eyebrow="Legal" title="Cookie Policy" narrow>
        <p className="text-offwhite/55 text-sm font-medium">Last updated: May 2026</p>
      </PublicInteriorHero>

      <section className="app-section border-b border-white/10">
        <div className="page-shell max-w-3xl">
          <div className="marketing-panel p-8 md:p-12 prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use StagePass.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-bold text-white mb-3">2.1 Essential Cookies</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Required for the website to function (authentication, security, account settings). These cannot be disabled.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2.2 Analytics Cookies</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Help us understand how users interact with the site (pages visited, time spent, features used). Used by Google Analytics and similar services.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2.3 Performance Cookies</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Optimize website speed, functionality, and user experience. May be provided by third parties.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2.4 Marketing Cookies</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                Track promotions and advertising effectiveness. Allow retargeting across platforms. You can opt-out.
              </p>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2.5 Attribution Tracking</h3>
              <p className="text-[#aaaaaa] leading-relaxed">
                StagePass uses cookies to track which creator link led to a ticket sale, ensuring accurate commission attribution.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                We work with service providers (Google Analytics, payment processors, hosting providers) who may set their own cookies. Their privacy practices govern their data use.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Managing Cookies</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-[#aaaaaa] space-y-2 mt-3">
                <li>Refuse cookies</li>
                <li>Delete existing cookies</li>
                <li>Receive notification when cookies are sent</li>
              </ul>
              <p className="text-[#aaaaaa] leading-relaxed mt-4">
                Note: Disabling essential cookies may impact site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. Data Retention</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                Cookies are typically retained for 1–2 years, depending on type. Authentication cookies persist while logged in.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-4">6. Contact Us</h2>
              <p className="text-[#aaaaaa] leading-relaxed">
                For cookie or privacy questions: <span className="text-primary">privacy@stagepass.com.au</span>
              </p>
            </section>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
