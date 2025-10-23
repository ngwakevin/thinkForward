
'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface FieldErrors { [k: string]: string }

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const formRef = useRef<HTMLFormElement|null>(null);
  const emailRef = useRef<HTMLInputElement|null>(null);
  const passwordRef = useRef<HTMLInputElement|null>(null);
  const nameRef = useRef<HTMLInputElement|null>(null);

  function passwordScore(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  }
  const pwScore = passwordScore(password);
  const pwLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError('');
    try {
      const normEmail = email.trim().toLowerCase();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password, name: name.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        else setGeneralError(data.error || 'Registration failed');

        const order = ['email','password','name'];
        for (const f of order) {
          if (data.fieldErrors?.[f]) {
            if (f==='email') emailRef.current?.focus();
            else if (f==='password') passwordRef.current?.focus();
            else if (f==='name') nameRef.current?.focus();
            break;
          }
        }
        return;
      }

      // Auto-login after registration
      if (data.user?.email) {
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: data.user.email,
          password,
          callbackUrl: '/',
        });

        if (loginResult?.ok) {
          if (formRef?.current) formRef.current.reset();
          setEmail('');
          setPassword('');
          setName('');
          window.location.href = loginResult.url || '/';
          return;
        }
      }

      if (formRef?.current) formRef.current.reset();
      setEmail('');
      setPassword('');
      setName('');
      alert('Registration successful!');
    } catch (err) {
      setGeneralError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  function handleOAuth(provider: 'google' | 'azure-ad') {
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-bg-alt/40 shadow-sm p-8">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Use email & password or sign in with:
            </p>

            {/* OAuth Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium bg-white hover:bg-gray-100"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('azure-ad')}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium bg-white hover:bg-gray-100"
              >
                Continue with Microsoft
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="name">Name (optional)</label>
                <input ref={nameRef} id="name" type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-md border bg-bg p-2 text-sm" placeholder="Ada Lovelace" />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="email">Email</label>
                <input ref={emailRef} id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-md border bg-bg p-2 text-sm" placeholder="you@example.com" />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="password">Password</label>
                <input ref={passwordRef} id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full rounded-md border bg-bg p-2 text-sm" placeholder="••••••••" />
                {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
                <p className="mt-1 text-[10px] text-fg-muted/70 flex items-center gap-2">At least 8 chars, include a letter & number.
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-20 rounded bg-border overflow-hidden">
                      <span className="block h-full transition-all duration-300 bg-fg" style={{ width: `${(pwScore/4)*100}%`, opacity: 0.6 + pwScore*0.1 }} />
                    </span>
                    <span className={`text-[10px] ${pwScore<2 ? 'text-red-500' : pwScore<3 ? 'text-amber-500' : pwScore<4 ? 'text-yellow-500' : 'text-emerald-500'}`}>{pwLabels[pwScore]}</span>
                  </span>
                </p>
              </div>
              {generalError && <div className="text-xs text-red-500">{generalError}</div>}
              <button type="submit" disabled={loading} className="w-full rounded-md bg-fg text-bg py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
            <p className="mt-4 text-xs text-fg-muted/70">By creating an account you agree to our <Link href="/docs/terms" className="underline hover:text-fg">Terms</Link>.</p>
        </div>
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-xs text-fg-muted">
          Already have an account? <Link href="/auth/login" className="underline hover:text-fg">Sign in</Link>.
        </div>
      </div>
    </div>
  );
}
