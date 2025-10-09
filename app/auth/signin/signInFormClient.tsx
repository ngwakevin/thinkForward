"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const normEmail = email.trim().toLowerCase();
      // Try credentials sign-in (if configured)
      const res: any = await signIn('credentials', { redirect: false, email: normEmail, password });
      if (res && !res.error) {
        // success -> redirect to home
        window.location.href = '/';
        return;
      }
      
      // Show specific error message
      if (res && res.error === 'CredentialsSignin') {
        setError('Invalid email or password');
      } else {
        setError('Sign in failed. Try using Microsoft login instead.');
      }
    } catch (e: any) {
      setError('Sign in failed');
    } finally { setLoading(false); }
  }
  
  async function handleMicrosoftLogin() {
    setLoading(true);
    try {
      await signIn('microsoft', { callbackUrl: '/' });
    } catch (e) {
      // Error handling is managed by NextAuth
      console.error('Microsoft login error:', e);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (e) {
      // Error handling is managed by NextAuth
      console.error('Google login error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium mb-1">Enter your email</label>
          <div className="relative">
            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium mb-1">Choose your password</label>
          <div className="relative flex items-center">
            <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-accent/40" />
            <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {error && <div className="text-xs text-red-500 -mt-2">{error}</div>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-accent/30 hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <div className="flex items-center gap-3 text-[10px] text-fg-muted/60">
        <div className="h-px flex-1 bg-border" /> <span>or continue with</span> <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-3">
        <button 
          type="button" 
          onClick={handleMicrosoftLogin} 
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium hover:bg-bg-alt/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <MicrosoftIcon className="h-5 w-5" />
          )}
          <span>{loading ? 'Signing in...' : 'Sign in with Microsoft'}</span>
        </button>
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium hover:bg-bg-alt/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors"
        >
          <GoogleIcon className="h-5 w-5" />
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
        <button type="button" disabled className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-border/70 bg-bg-alt/40 px-4 py-2 text-sm font-medium text-fg-muted/60 cursor-not-allowed">
          <AppleIcon className="h-5 w-5" />
          <span>Sign in with Apple (soon)</span>
        </button>
      </div>
    </form>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.5 5.5A10.6 10.6 0 0 1 12 4c7 0 11 8 11 8a17.6 17.6 0 0 1-3 4.5M6.2 6.2C2.7 8.1 1 12 1 12s4 8 11 8a11 11 0 0 0 5.5-1.5" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M12 11h11c.1.6.2 1.1.2 1.8 0 6-4 10.2-11.2 10.2A11.8 11.8 0 0 1 0 12 11.8 11.8 0 0 1 12 .8c3.2 0 5.9 1.2 8 3.1l-3.4 3.3c-.9-.8-2.3-1.6-4.6-1.6-3.9 0-7 3.2-7 7.2s3.1 7.2 7 7.2c4.5 0 6.2-3.2 6.5-4.8H12V11Z" />
    </svg>
  );
}
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 2c-.9.1-2 .5-2.7 1.2-.6.6-1.2 1.6-1 2.6 1 .1 2-.4 2.7-1.1.6-.6 1.1-1.6 1-2.7ZM20.9 17c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.5 3.1-4.2 3.1-1.6 0-2-.9-4-.9-2.1 0-2.5.9-4.1.9-1.7 0-3-1.6-4.1-3-2.8-4-3.1-8.7-1.4-11.2 1-1.6 2.7-2.6 4.6-2.6 1.7 0 3.3 1 4 1 .8 0 2.3-1.1 4-1 1.4.1 2.7.7 3.6 1.7-3.2 1.8-2.7 6.6.5 7.8-.3.9-.7 1.6-1.4 2.5Z" />
    </svg>
  );
}
