'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, X } from 'lucide-react';

type Mode = 'signin' | 'signup';

const slides = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
];

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-dark flex items-center justify-center text-white/60 text-sm">
          Loading…
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const search = useSearchParams();

  const requestedMode = search.get('mode');
  const [mode, setMode] = useState<Mode>(requestedMode === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [accountType, setAccountType] = useState<'creator' | 'promoter'>('creator');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [devBypass, setDevBypass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const next = search.get('next') ?? '/app/dashboard';

  useEffect(() => {
    const t = window.setInterval(() => {
      setSlideIndex((p) => (p + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/dev-config')
      .then((r) => r.json())
      .then((j: { devAuthBypass?: boolean }) => {
        if (!cancelled) setDevBypass(Boolean(j.devAuthBypass));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit() {
    setLoading(true);
    setError(null);
    setInfo(null);

    const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
    const payload =
      mode === 'signin'
        ? { email, password }
        : {
            email,
            password,
            displayName,
            handle,
            accountType,
            ...(accountType === 'promoter' && orgName.trim() ? { orgName: orgName.trim() } : {}),
          };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      role?: 'creator' | 'promoter' | 'admin';
      sessionEstablished?: boolean;
      message?: string;
    };
    if (!res.ok) {
      setError(json.error ?? 'Request failed');
      setLoading(false);
      return;
    }

    if (mode === 'signup' && json.sessionEstablished === false) {
      setInfo(json.message ?? 'Account created. Confirm your email if required, then sign in with the same email and password.');
      setMode('signin');
      setLoading(false);
      return;
    }

    const role = json.role ?? 'creator';
    if (role === 'creator') {
      router.push(next.startsWith('/admin') ? '/app/dashboard' : next);
    } else {
      router.push(next.startsWith('/app') ? '/admin/dashboard' : next);
    }
  }

  async function forgotPassword() {
    setError(null);
    setInfo(null);
    if (!email) {
      setError('Enter your email first.');
      return;
    }

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };

    if (!res.ok) {
      setError(json.error ?? 'Could not send reset email.');
      return;
    }

    setInfo(json.message ?? 'Reset email sent.');
  }

  async function devTestLogin(testRole: 'creator' | 'promoter' | 'admin') {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ role: testRole }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Dev login failed');
        return;
      }
      if (testRole === 'creator') {
        router.push(next.startsWith('/admin') ? '/app/dashboard' : next);
      } else {
        router.push(next.startsWith('/app') ? '/admin/dashboard' : next);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <Image key={slides[slideIndex]} src={slides[slideIndex]} alt="Stagepass login background" fill sizes="100vw" className="object-cover transition-opacity duration-1000" priority />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(25,105,255,0.22),transparent_30%),linear-gradient(180deg,rgba(6,9,14,0.62),rgba(6,8,12,0.92))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />

      <div className="relative z-10 h-screen w-full px-4 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#e8ebf0] text-[#10131a] p-6 md:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)]">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-[#2d3340]">Log In or Sign Up</div>
            <Link href="/" className="w-9 h-9 rounded-full bg-[#d6dae2] flex items-center justify-center hover:bg-[#cfd4de] transition-colors">
              <X className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button type="button" onClick={() => setMode('signin')} className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'signin' ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] border border-[#d8dce3]'}`}>
              Sign in
            </button>
            <button type="button" onClick={() => setMode('signup')} className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] border border-[#d8dce3]'}`}>
              Create account
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('creator')}
                    className={`h-10 rounded-xl text-sm font-semibold transition-colors ${accountType === 'creator' ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] border border-[#d8dce3]'}`}
                  >
                    Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('promoter')}
                    className={`h-10 rounded-xl text-sm font-semibold transition-colors ${accountType === 'promoter' ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] border border-[#d8dce3]'}`}
                  >
                    Promoter
                  </button>
                </div>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" className="w-full h-12 rounded-xl bg-white border border-[#d7dce3] px-4 text-[#111827]" />
                <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Handle (e.g. maya.rodriguez)" className="w-full h-12 rounded-xl bg-white border border-[#d7dce3] px-4 text-[#111827]" />
                {accountType === 'promoter' && (
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Organisation name"
                    className="w-full h-12 rounded-xl bg-white border border-[#d7dce3] px-4 text-[#111827]"
                  />
                )}
              </>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-12 rounded-xl bg-white border border-[#d7dce3] px-4 text-[#111827]" />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full h-12 rounded-xl bg-white border border-[#d7dce3] pl-4 pr-12 text-[#111827]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#4d5565] hover:bg-[#eef0f4] hover:text-[#111827] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
          {info && <div className="text-sm text-emerald-700 mt-3">{info}</div>}

          <Button variant="premium" className="h-12 w-full mt-4" onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Continue' : 'Create account'}
          </Button>

          <button type="button" onClick={forgotPassword} className="mt-3 w-full text-sm text-[#3d4f7c] hover:underline">
            Forgot password?
          </button>

          <div className="mt-5 text-center text-sm text-[#4d5565]">
            Promoter access requires Stagepass Ops approval after application.
          </div>

          {devBypass && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-900">Local test (no Supabase)</div>
              <p className="mt-1 text-xs text-amber-950/80">
                <code className="rounded bg-amber-100/80 px-1">STAGEPASS_DEV_AUTH_BYPASS=1</code> is on. Quick entry:
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button type="button" variant="outline" className="h-9 text-xs border-amber-300 bg-white" disabled={loading} onClick={() => devTestLogin('creator')}>
                  Creator
                </Button>
                <Button type="button" variant="outline" className="h-9 text-xs border-amber-300 bg-white" disabled={loading} onClick={() => devTestLogin('promoter')}>
                  Promoter
                </Button>
                <Button type="button" variant="outline" className="h-9 text-xs border-amber-300 bg-white" disabled={loading} onClick={() => devTestLogin('admin')}>
                  Admin
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-xs text-[#677085]">Google/Apple SSO can be enabled from Supabase Auth providers.</div>
        </div>
      </div>
    </main>
  );
}
