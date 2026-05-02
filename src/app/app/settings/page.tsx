'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/MetricCard';
import { Lock, Download, Upload, Key, Bell, Plug, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreatorSettingsPage() {
  const [profileData, setProfileData] = useState({
    displayName: 'Alex Chen',
    email: 'alex@creators.com',
    bio: 'Festival curator and culture enthusiast',
    instagramHandle: '@alexchen',
    tiktokHandle: '@alexchen',
    audience: '45.2K',
  });

  const [bankData, setBankData] = useState({
    accountName: 'Alex Chen',
    bsb: '033-087',
    accountNumber: '••••••••8752',
  });

  const [formChanged, setFormChanged] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setFormChanged(true);
  };

  return (
    <DashboardShell>
      <div className="max-w-4xl space-y-10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
          <p className="text-[#aaaaaa]">Manage your profile, payment method, and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Display Name</label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => handleProfileChange('displayName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/50 placeholder-white/50 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Instagram Handle</label>
                <input
                  type="text"
                  value={profileData.instagramHandle}
                  onChange={(e) => handleProfileChange('instagramHandle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">TikTok Handle</label>
                <input
                  type="text"
                  value={profileData.tiktokHandle}
                  onChange={(e) => handleProfileChange('tiktokHandle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {formChanged && (
              <div className="flex gap-4">
                <Button variant="premium" className="h-12 px-8">
                  Save Changes
                </Button>
                <Button variant="outline" className="h-12 px-8 text-white border-white/30 hover:bg-white/10" onClick={() => setFormChanged(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Bank Details Section */}
        <Card className="p-8 bg-white/5 border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6" /> Payment Method
            </h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-[#aaaaaa] uppercase tracking-wider mb-4">Bank Account</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-white/60 text-sm mb-1">Account Name</p>
                  <p className="text-white font-semibold">{bankData.accountName}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">BSB</p>
                  <p className="text-white font-semibold">{bankData.bsb}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Account Number</p>
                  <p className="text-white font-semibold">{bankData.accountNumber}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-6 h-12 text-white border-white/30 hover:bg-white/10">
                Update Bank Details
              </Button>
            </div>
          </div>
        </Card>

        {/* Integrations */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Plug className="w-6 h-6" /> Integrations
          </h2>
          <p className="text-sm text-offwhite/45 mb-6">Connect tools for social verification, email, and ticketing (Phase 2+).</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              Instagram Graph (coming soon)
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start" disabled>
              TikTok Display API (coming soon)
            </Button>
          </div>
        </Card>

        {/* Preferences Section */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications &amp; email
          </h2>
          <p className="text-sm text-offwhite/45 mb-6">Control product and marketing email separately (Spam Act opt-in).</p>
          <div className="space-y-4">
            {[
              { label: 'New event launches', enabled: true },
              { label: 'Campaign performance updates', enabled: true },
              { label: 'Payout notifications', enabled: true },
              { label: 'Promotional emails', enabled: false },
            ].map((pref) => (
              <label key={pref.label} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" defaultChecked={pref.enabled} className="w-5 h-5 rounded cursor-pointer" />
                <span className="text-white">{pref.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Security Section */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Key className="w-6 h-6" /> Security
          </h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
              View Login Activity
            </Button>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Data, privacy &amp; cookies</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2">
              <Download className="w-5 h-5" /> Download My Data
            </Button>
            <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2">
              <Upload className="w-5 h-5" /> Export Campaign History
            </Button>
            <Link href="/legal/cookies" className="block">
              <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2">
                <Cookie className="w-5 h-5" /> Cookie &amp; tracking preferences
              </Button>
            </Link>
            <Link href="/legal/privacy" className="block text-sm text-primary hover:underline px-1">
              Privacy policy &amp; data deletion requests →
            </Link>
          </div>
        </Card>

        {/* Account Deletion */}
        <Card className="p-8 bg-red-950/20 border-red-900/30">
          <h2 className="text-2xl font-bold text-white mb-3">Danger Zone</h2>
          <p className="text-[#aaaaaa] mb-6">
            Delete your account and all associated data. This action is permanent and cannot be undone.
          </p>
          <Button variant="outline" className="h-12 text-red-400 border-red-900/50 hover:bg-red-950/30">
            Delete Account
          </Button>
        </Card>
      </div>
    </DashboardShell>
  );
}
