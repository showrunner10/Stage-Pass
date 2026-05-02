'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { creators } from '@/data/mock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Profile() {
  const creator = creators[0];

  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Creator Profile</h1>
            <p className="text-offwhite/40">Your public presence, brand kit, and payout placeholders.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-white border-white/10 hover:bg-white/5" asChild>
              <Link href="/app/builder">Open Link Builder</Link>
            </Button>
            <Button variant="premium">Save</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xl">
            {creator.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="text-white font-bold text-xl">{creator.name}</div>
            <div className="text-offwhite/40 text-sm">@{creator.handle}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-offwhite/80">
            <span className="text-white font-semibold">Public page:</span>{' '}
            <span className="text-primary">{creator.handle}.stage.page</span>
            <span className="text-offwhite/45"> · resolves to </span>
            <span className="text-offwhite/70">/c/{creator.handle}/…</span> in this prototype (wildcard DNS later).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-offwhite/60 mb-2">Display name</div>
              <input
                defaultValue={creator.name}
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <div className="text-sm text-offwhite/60 mb-2">Subdomain (handle)</div>
              <input
                defaultValue={`${creator.handle}.stage.page`}
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="text-sm text-offwhite/60 mb-2">Bio</div>
            <textarea
              rows={3}
              defaultValue="DJ & festival creator · Sydney. I only promote events I actually attend."
              className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-offwhite/60 mb-2">Instagram</div>
              <input
                defaultValue="@maya.rodriguez"
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <div className="text-sm text-offwhite/60 mb-2">TikTok</div>
              <input
                defaultValue="@mayarodriguez"
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-offwhite/60 mb-2">YouTube</div>
              <input
                placeholder="Channel URL"
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary placeholder:text-offwhite/35"
              />
            </div>
            <div>
              <div className="text-sm text-offwhite/60 mb-2">Audience size</div>
              <input
                defaultValue={creator.audienceSize}
                className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-dark p-5">
            <div className="text-white font-bold mb-2">Brand kit</div>
            <div className="text-sm text-offwhite/50">
              Upload avatar, cover image, and approved copy in production phase.
            </div>
            <div className="text-xs text-offwhite/40 mt-3">
              Creators get official assets from each listing&apos;s <strong className="text-offwhite/60">promoter asset pack</strong> (logos,
              banners, copy, UTM guidance). Download from the event page or marketplace brief. You can add your own avatar and cover here.
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                Upload assets
              </Button>
              <Button variant="ghost" className="text-offwhite/60 hover:text-white">
                Preview
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-dark p-5">
            <div className="text-white font-bold mb-2">Payout settings</div>
            <div className="text-sm text-offwhite/50">
              Stripe Connect planned. This UI will connect to Stripe Express onboarding in production.
            </div>
            <div className="mt-4">
              <Button variant="premium">Connect Stripe Express</Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-offwhite/30">Stripe Connect planned for production phase.</div>
      </div>
    </DashboardShell>
  );
}
