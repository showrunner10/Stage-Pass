'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast-store';
import { passwordPolicyMessage } from '@/lib/auth/password-policy';

type Mode = 'signin' | 'signup';

type PasswordStrength = {
  label: 'Too weak' | 'Weak' | 'Medium' | 'Strong';
  score: 1 | 2 | 3 | 4;
  color: string;
  textColor: string;
};

const slides = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
];

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

  if (score <= 1) {
    return {
      label: 'Too weak',
      score: 1,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    };
  }

  if (score === 2) {
    return {
      label: 'Weak',
      score: 2,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    };
  }

  if (score === 3) {
    return {
      label: 'Medium',
      score: 3,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
    };
  }

  return {
    label: 'Strong',
    score: 4,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
  };
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M9 7.05v3.62h5.03c-.22 1.16-.9 2.14-1.92 2.8l3.1 2.4c1.8-1.66 2.84-4.1 2.84-6.98 0-.68-.06-1.34-.18-1.97H9Z" />
      <path fill="#4285F4" d="M9 18c2.57 0 4.73-.85 6.3-2.3l-3.1-2.4c-.86.58-1.96.93-3.2.93-2.46 0-4.54-1.67-5.29-3.91H.5v2.46A9.5 9.5 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.71 10.32A5.71 5.71 0 0 1 3.41 9c0-.46.08-.91.22-1.32V5.22H.5A9 9 0 0 0 0 9c0 1.45.35 2.83.97 4.06l2.74-2.74Z" />
      <path fill="#34A853" d="M9 3.58c1.4 0 2.64.48 3.62 1.42l2.7-2.7C13.72.8 11.56 0 9 0A9.5 9.5 0 0 0 .5 5.22l3.13 2.46C4.39 5.24 6.53 3.58 9 3.58Z" />
    </svg>
  );
}

function SsoButton({
  label,
  description,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  description: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex h-14 w-full items-center rounded-2xl border border-[#d4dae5] bg-white px-4 text-left shadow-[0_10px_20px_-18px_rgba(16,19,26,0.45)] transition-all hover:-translate-y-0.5 hover:border-[#c3cbdb] hover:shadow-[0_18px_30px_-20px_rgba(16,19,26,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f7fb] text-[#111827]">
        <GoogleMark />
      </span>
      <span className="ml-3 flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-[#111827]">{label}</span>
        <span className="text-xs text-[#6a7387]">{description}</span>
      </span>
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin text-[#4f46e5]" />
      ) : (
        <span className="text-xs font-medium text-[#798297] transition-colors group-hover:text-[#495266]">SSO</span>
      )}
    </button>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-dark text-sm text-white/60">
          Loading...
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
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sendingResetCode, setSendingResetCode] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | null>(null);
  const passwordHint = passwordPolicyMessage();
  const signupStrength = getPasswordStrength(password);
  const resetStrength = getPasswordStrength(newPassword);
  const enableGoogleOauth = false;

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

  useEffect(() => {
    const oauthError = search.get('error');
    if (oauthError) {
      setError(oauthError);
      toast.error('Authentication failed', oauthError);

      const params = new URLSearchParams(search.toString());
      params.delete('error');
      params.delete('error_code');
      params.delete('error_description');
      const nextQuery = params.toString();
      router.replace(nextQuery ? `/login?${nextQuery}` : '/login');
    }
  }, [router, search]);

  useEffect(() => {
    const authStatus = search.get('auth');
    if (authStatus === 'signed_out') {
      toast.success('Signed out', 'You have been logged out successfully.');
    }
    if (authStatus === 'confirmed') {
      toast.success('Email confirmed', 'Your account is ready. Sign in to continue.');
      setMode('signin');
    }
  }, [search]);

  async function submit() {
    setLoading(true);
    setError(null);
    setInfo(null);

    const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
    const normalizedHandle = handle.trim().replace(/^@+/, '').replace(/\s+/g, '');
    const payload =
      mode === 'signin'
        ? { email, password }
        : {
            email,
            password,
            displayName,
            handle: normalizedHandle,
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
      const message = json.error ?? 'Request failed';
      setError(message);
      toast.error(mode === 'signin' ? 'Sign in failed' : 'Sign up failed', message);
      setLoading(false);
      return;
    }

    if (mode === 'signup' && json.sessionEstablished === false) {
      const message = json.message ?? 'Account created. Confirm your email if required, then sign in with the same email and password.';
      setInfo(message);
      toast.success('Account created', 'Check your email to confirm your account, then sign in.');
      setMode('signin');
      setLoading(false);
      return;
    }

    toast.success(mode === 'signin' ? 'Signed in' : 'Account created', mode === 'signin' ? 'Welcome back to Stagepass.' : 'Your account is ready.');
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

    setSendingResetCode(true);
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setSendingResetCode(false);

    if (!res.ok) {
      const message = json.error ?? 'Could not send reset code.';
      setError(message);
      toast.error('Reset failed', message);
      return;
    }

    setShowReset(true);
    setResetCodeSent(true);
    const message = json.message ?? 'Reset code sent.';
    setInfo(message);
    toast.success('Reset code sent', 'Check your email for the verification code.');
  }

  async function confirmReset() {
    setError(null);
    setInfo(null);
    if (!email) {
      setError('Enter your email first.');
      return;
    }

    setResettingPassword(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code: resetCode, newPassword }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setResettingPassword(false);

    if (!res.ok) {
      const message = json.error ?? 'Could not reset password.';
      setError(message);
      toast.error('Password reset failed', message);
      return;
    }

    setInfo(json.message ?? 'Password updated. You can now sign in.');
    toast.success('Password updated', 'You can now sign in with your new password.');
    setShowReset(false);
    setResetCode('');
    setNewPassword('');
    setPassword('');
    setMode('signin');
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

  function startOauth(provider: 'google') {
    setError(null);
    setInfo(null);
    setOauthLoading(provider);
    const params = new URLSearchParams({
      provider,
      next,
      origin: window.location.origin,
    });
    window.location.href = `/api/auth/oauth/start?${params.toString()}`;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-dark text-white">
      <div className="absolute inset-0">
        <Image key={slides[slideIndex]} src={slides[slideIndex]} alt="Stagepass login background" fill sizes="100vw" className="object-cover transition-opacity duration-1000" priority />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(25,105,255,0.22),transparent_30%),linear-gradient(180deg,rgba(6,9,14,0.62),rgba(6,8,12,0.92))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#e8ebf0] p-6 text-[#10131a] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)] md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.12em] text-[#2d3340]">Log In or Sign Up</div>
              <div className="mt-1 text-sm text-[#6b7386]">Secure access for creators, promoter teams, and Stagepass Ops.</div>
            </div>
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6dae2] transition-colors hover:bg-[#cfd4de]">
              <X className="h-4 w-4" />
            </Link>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode('signin')} className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'signin' ? 'bg-[#111827] text-white' : 'border border-[#d8dce3] bg-white text-[#111827]'}`}>
              Sign in
            </button>
            <button type="button" onClick={() => setMode('signup')} className={`h-10 rounded-xl text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-[#111827] text-white' : 'border border-[#d8dce3] bg-white text-[#111827]'}`}>
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
                    className={`h-10 rounded-xl text-sm font-semibold transition-colors ${accountType === 'creator' ? 'bg-[#111827] text-white' : 'border border-[#d8dce3] bg-white text-[#111827]'}`}
                  >
                    Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('promoter')}
                    className={`h-10 rounded-xl text-sm font-semibold transition-colors ${accountType === 'promoter' ? 'bg-[#111827] text-white' : 'border border-[#d8dce3] bg-white text-[#111827]'}`}
                  >
                    Promoter
                  </button>
                </div>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white px-4 text-[#111827]" />
                <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Handle (e.g. maya.rodriguez)" className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white px-4 text-[#111827]" />
                {accountType === 'promoter' && (
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Organisation name"
                    className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white px-4 text-[#111827]"
                  />
                )}
              </>
            )}

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white px-4 text-[#111827]" />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white pl-4 pr-12 text-[#111827]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 rounded-lg p-2 text-[#4d5565] transition-colors hover:bg-[#eef0f4] hover:text-[#111827] -translate-y-1/2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {mode === 'signup' ? (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1.5 flex-1 rounded-full ${
                        signupStrength.score >= bar ? signupStrength.color : 'bg-[#d7dce3]'
                      }`}
                    />
                  ))}
                </div>
                <div className={`text-xs font-medium ${signupStrength.textColor}`}>{signupStrength.label}</div>
                <div className="text-xs text-[#6b7386]">{passwordHint}</div>
              </div>
            ) : null}
          </div>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          {info && <div className="mt-3 text-sm text-emerald-700">{info}</div>}

          <Button variant="premium" className="mt-4 h-12 w-full" onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Continue' : 'Create account'}
          </Button>

          {enableGoogleOauth && (
            <>
              <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b93a5]">
                <div className="h-px flex-1 bg-[#d2d7e2]" />
                <span>Or continue with</span>
                <div className="h-px flex-1 bg-[#d2d7e2]" />
              </div>

              <div className="space-y-3">
                <SsoButton
                  label={mode === 'signin' ? 'Sign in with Google' : 'Continue with Google'}
                  description="Use your Google identity for a secure one-tap flow"
                  loading={oauthLoading === 'google'}
                  disabled={oauthLoading !== null}
                  onClick={() => startOauth('google')}
                />
              </div>
            </>
          )}

          <button type="button" onClick={forgotPassword} className="mt-3 w-full text-sm text-[#3d4f7c] hover:underline" disabled={sendingResetCode}>
            {sendingResetCode ? 'Sending code...' : 'Forgot password?'}
          </button>

          {showReset && (
            <div className="mt-4 space-y-3 rounded-2xl border border-[#d7dce3] bg-white p-4">
              <div className="text-sm font-semibold text-[#111827]">Reset with email code</div>
              <p className="text-xs text-[#4d5565]">
                {resetCodeSent ? 'Enter the 6-digit code from your email and choose a new password.' : 'Request a reset code first.'}
              </p>
              <input
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white px-4 tracking-[0.35em] text-[#111827]"
              />
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[#d7dce3] bg-white pl-4 pr-12 text-[#111827]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2 top-1/2 rounded-lg p-2 text-[#4d5565] transition-colors hover:bg-[#eef0f4] hover:text-[#111827] -translate-y-1/2"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1.5 flex-1 rounded-full ${
                        resetStrength.score >= bar ? resetStrength.color : 'bg-[#d7dce3]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${resetStrength.textColor}`}>{resetStrength.label}</p>
                <p className="text-xs text-[#4d5565]">{passwordHint}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11 bg-white" onClick={forgotPassword} disabled={sendingResetCode}>
                  Resend code
                </Button>
                <Button variant="premium" className="h-11" onClick={confirmReset} disabled={resettingPassword}>
                  {resettingPassword ? 'Resetting...' : 'Set new password'}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-5 text-center text-sm text-[#4d5565]">
            Promoter access requires Stagepass Ops approval after application.
          </div>

          {mode === 'signin' && (
            <div className="mt-5 rounded-2xl border border-[#cbd3df] bg-white px-4 py-3 text-left">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#2d3340]">Preview access</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button type="button" variant="outline" className="h-9 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('creator')}>
                  Creator
                </Button>
                <Button type="button" variant="outline" className="h-9 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('promoter')}>
                  Promoter
                </Button>
                <Button type="button" variant="outline" className="h-9 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('admin')}>
                  Admin
                </Button>
              </div>
            </div>
          )}

          {devBypass && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-900">Local access (development only)</div>
              <p className="mt-1 text-xs text-amber-950/80">
                <code className="rounded bg-amber-100/80 px-1">STAGEPASS_DEV_AUTH_BYPASS=1</code> is on. Quick entry:
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button type="button" variant="outline" className="h-9 border-amber-300 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('creator')}>
                  Creator
                </Button>
                <Button type="button" variant="outline" className="h-9 border-amber-300 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('promoter')}>
                  Promoter
                </Button>
                <Button type="button" variant="outline" className="h-9 border-amber-300 bg-white text-xs" disabled={loading} onClick={() => devTestLogin('admin')}>
                  Admin
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
