'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { PublicInteriorHero } from '@/components/layout/PublicInteriorHero';

function ContactFormInner() {
  const search = useSearchParams();
  const intent = search.get('intent');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyRole: '',
    audience: 'other' as 'creator' | 'promoter' | 'other',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (intent === 'demo') {
      setFormData((p) => ({
        ...p,
        audience: 'promoter',
        subject: p.subject || 'Book a demo — promoter',
        message:
          p.message ||
          'I would like to book a demo to list events on Stagepass and discuss creator approvals + attribution.',
      }));
    }
  }, [intent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to CRM / email API
    console.log('Contact form:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="min-h-screen bg-dark page-fade-in">
      <PublicNavbar />

      <PublicInteriorHero eyebrow="Contact" title="Let’s talk events & creators." narrow>
        <p className="text-lg md:text-xl text-offwhite/70 leading-relaxed">
          Demos for promoters, support for creators, press & partnerships. Email{' '}
          <a href="mailto:hello@stagepass.com.au" className="text-primary font-semibold hover:underline">
            hello@stagepass.com.au
          </a>
        </p>
        {intent === 'demo' ? (
          <div className="mt-8 marketing-panel border-primary/30 bg-primary/[0.07] px-5 py-4 text-sm text-offwhite/90 max-w-2xl">
            You&apos;re booking a <strong className="text-white">promoter demo</strong>. Include org name, events, and timeline—we&apos;ll
            reply to schedule.
          </div>
        ) : null}
      </PublicInteriorHero>

      <section className="app-section border-b border-white/10">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <div className="marketing-panel marketing-panel-hover p-8 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mx-auto lg:mx-0 mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Support email</h3>
              <a href="mailto:hello@stagepass.com.au" className="text-lg text-primary font-semibold hover:underline">
                hello@stagepass.com.au
              </a>
              <p className="text-offwhite/55 text-sm mt-3">Creators &amp; promoters</p>
            </div>
            <div className="marketing-panel marketing-panel-hover p-8 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mx-auto lg:mx-0 mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Location</h3>
              <p className="text-lg text-white font-semibold">Sydney, Australia</p>
              <p className="text-offwhite/55 text-sm mt-3">Primary region · APAC</p>
            </div>
            <div className="marketing-panel marketing-panel-hover p-8 text-center lg:text-left">
              <h3 className="text-lg font-bold text-white mb-5">Social</h3>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <a
                  href="https://www.facebook.com/stagepass/?fref=ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/15 text-offwhite/70 hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/stagepasscom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/15 text-offwhite/70 hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/15 text-offwhite/70 hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <p className="text-offwhite/45 text-sm mt-4">Update Instagram link to your official handle.</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto marketing-panel p-8 sm:p-10" id="form">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white">Send a message</h2>
              <Link href="/contact?intent=demo#form">
                <Button variant="outline_premium" className="border-primary/50 shrink-0">
                  Book a demo
                </Button>
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/45 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/45 focus:outline-none focus:border-primary transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Company / role *</label>
                <input
                  type="text"
                  name="companyRole"
                  value={formData.companyRole}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/45 focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Secret Sounds · Marketing Lead"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">I am a *</label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'creator' || v === 'promoter' || v === 'other') {
                      setFormData((p) => ({ ...p, audience: v }));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="creator">Creator</option>
                  <option value="promoter">Promoter</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/45 focus:outline-none focus:border-primary transition-colors"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/45 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Events, timelines, integrations…"
                />
              </div>
              <Button variant="premium" type="submit" className="w-full h-14 text-lg">
                Send message
              </Button>
            </form>
            {submitted && (
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary text-center">
                Thanks — we&apos;ll reply soon. For urgent promoter onboarding, mention dates in your message.
              </div>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark" />}>
      <ContactFormInner />
    </Suspense>
  );
}
