"use client";

import { useState, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

interface FieldErrors { [key: string]: string }

export default function SignUpForm() {
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  function passwordScore(pw: string) {
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

        const order = ['email', 'password', 'name'];
        for (const f of order) {
          if (data.fieldErrors?.[f]) {
            if (f === 'email') emailRef.current?.focus();
            else if (f === 'password') passwordRef.current?.focus();
            else if (f === 'name') nameRef.current?.focus();
            break;
          }
        }
        return;
      }

      if (data.user?.email) {
        formRef.current?.reset();
        setEmail('');
        setName('');
        setPassword('');

        await signIn('credentials', {
          redirect: true,
          email: data.user.email,
          password,
          callbackUrl: '/dashboard',
        });
        return;
      }
    } catch (err) {
      console.error(err);
      setGeneralError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'microsoft') => {
    const providerId = provider === 'microsoft' ? 'azure-ad' : provider;
    signIn(providerId, { callbackUrl: '/profile?tab=bootcamps' });
  };

  if (status === 'loading') return <div className="mx-auto max-w-md p-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-bg-alt/40 shadow-sm p-8">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Use email & password or sign in with:
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="flex-1 rounded-md bg-red-500 text-white py-2 text-sm font-medium"
            >
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('microsoft')}
              className="flex-1 rounded-md bg-blue-600 text-white py-2 text-sm font-medium"
            >
              Sign in with Microsoft
            </button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-1">Name (optional)</label>
              <input
                ref={nameRef}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border bg-bg p-2 text-sm"
                placeholder="Ada Lovelace"
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border bg-bg p-2 text-sm"
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1">Password</label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border bg-bg p-2 text-sm"
                placeholder="••••••••"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
              <p className="mt-1 text-[10px] text-fg-muted/70 flex items-center gap-2">
                At least 8 chars, include a letter & number.
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-20 rounded bg-border overflow-hidden">
                    <span
                      className="block h-full transition-all duration-300 bg-fg"
                      style={{ width: `${(pwScore / 4) * 100}%`, opacity: 0.6 + pwScore * 0.1 }}
                    />
                  </span>
                  <span
                    className={`text-[10px] ${
                      pwScore < 2 ? 'text-red-500' : pwScore < 3 ? 'text-amber-500' : pwScore < 4 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}
                  >
                    {pwLabels[pwScore]}
                  </span>
                </span>
              </p>
            </div>

            {generalError && <div className="text-xs text-red-500">{generalError}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-fg text-bg py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-xs text-fg-muted/70">
            By creating an account you agree to our <Link href="/docs/terms" className="underline hover:text-fg">Terms</Link>.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-border/60 p-4 text-xs text-fg-muted">
          Already have an account? <Link href="/login" className="underline hover:text-fg">Sign in</Link>.
        </div>
      </div>
    </div>
  );
}
