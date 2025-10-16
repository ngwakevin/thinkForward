'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type RegisterResponse = {
  ok: boolean;
  registration?: {
    id: string;
    paymentReference: string;
    createdAt: string;
    status: string;
    track?: string;
    name: string;
    email: string;
  };
  error?: string;
};

type Props = {
  track?: string;
};

const BANK_DETAILS = Object.freeze({
  beneficiary: 'Cloudegree',
  iban: 'LT87 3250 0053 9126 0734',
  bic: 'REVOLT21',
  bankName: 'Revolut Bank UAB',
  bankAddress: 'Konstitucijos ave. 21B, 08130, Vilnius, Lithuania',
  correspondentBic: 'CHASDEFX'
});

export function RegisterFormClient({ track }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegisterResponse['registration'] | null>(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hiddenTrackValue = track ?? '';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload: Record<string, FormDataEntryValue | undefined> = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      // Validate password fields if creating an account
      if (createAccount) {
        if (!password) {
          setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
          throw new Error('Password is required');
        }
        if (password !== confirmPassword) {
          setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
          throw new Error('Passwords do not match');
        }
        // Add password to payload
        payload.password = password;
        payload.confirmPassword = confirmPassword;
      }

      // Use the register-bootcamp API if creating an account, otherwise use bootcamps/register
      const endpoint = createAccount ? '/api/register-bootcamp' : '/api/bootcamps/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        // Handle field-specific errors
        if (json.fieldErrors && Object.keys(json.fieldErrors).length > 0) {
          setFieldErrors(json.fieldErrors);
          throw new Error('Please correct the highlighted fields.');
        }
        throw new Error(json.error || 'Something went wrong while submitting the form.');
      }

      if (!json.registration && !createAccount) {
        throw new Error('No registration information received from the server.');
      }

      // If registering with account creation, the API returns a different response structure
      const registration = json.registration || (json.createdUser ? { 
        id: json.user?.id, 
        paymentReference: json.registration?.paymentReference, 
        createdAt: json.registration?.createdAt,
        status: json.registration?.paymentStatus,
        track: json.registration?.track,
        name: json.user?.name,
        email: json.user?.email
      } : null);

      if (!registration) {
        throw new Error('Registration information is missing from the response.');
      }
      
      setSuccess(registration);
      event.currentTarget.reset();
      setPassword('');
      setConfirmPassword('');
      
      // If account was created, automatically log the user in
      if (createAccount && json.createdUser && json.user?.email) {
        try {
          console.log('Attempting auto-login for new user:', json.user.email);
          
          // Attempt to sign in with the newly created credentials
          const signInResult = await signIn('credentials', { 
            email: json.user.email, 
            password: password,
            redirect: true, // Redirect the user after successful login
            callbackUrl: '/profile?tab=bootcamps' // Set callback URL for redirection
          });
          
          // This code will only execute if redirect is false
          if (signInResult?.ok) {
            console.log('Auto login successful after registration, redirecting manually');
            
            // We'll wait a short time to ensure the session is fully established
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store login information in localStorage for persistence
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', json.user.email);
            
            // Manual redirect as a fallback
            window.location.href = '/profile?tab=bootcamps';
          } else {
            console.error('Auto login failed:', signInResult?.error);
          }
        } catch (signInError) {
          console.error('Auto login failed after registration:', signInError);
          // We don't show an error to the user as registration was successful
        }
      }
    } catch (err: any) {
      console.error('Bootcamp registration submission failed', err);
      setError(err?.message || 'Unable to submit your registration. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const mailtoHref = `mailto:hello@thinkforward.academy?subject=Bootcamp%20Payment%20Reference%20${encodeURIComponent(success.paymentReference)}`;
    return (
      <div className="space-y-8 rounded-3xl border border-success/30 bg-success/10 p-8 text-sm text-white/90">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-success">
              <span className="i-lucide-badge-check" />
              Registration Received
            </p>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              success.status === 'Confirmed' 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : success.status === 'Rejected'
                ? 'bg-red-500/20 text-red-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              <span className={`${
                success.status === 'Confirmed' 
                  ? 'i-lucide-check-circle' 
                  : success.status === 'Rejected'
                  ? 'i-lucide-x-circle'
                  : 'i-lucide-clock'
              }`} />
              {success.status === 'Confirmed' 
                ? 'Payment Confirmed' 
                : success.status === 'Rejected'
                ? 'Payment Rejected'
                : 'Awaiting Payment'}
            </div>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
            {success.status === 'Confirmed' 
              ? 'You&apos;re all set!' 
              : 'You&apos;re almost there!'}
          </h2>
          <p className="text-white/80">
            {(() => {
              const metadata = (success as any)?.metadata ?? {};
              const rawName =
                (typeof metadata.nameFirst === 'string' && metadata.nameFirst) ||
                (typeof metadata.name === 'string' && metadata.name) ||
                (typeof success.name === 'string' && success.name) ||
                '';
              const friendlyName = rawName.trim().split(' ')[0] || 'there';
              return (
                <>
                  Thanks {friendlyName}, we&apos;ve received your registration. To secure your seat, please arrange a bank
                  transfer using the details below. Include your payment reference in the transfer note so our team can
                  match your payment quickly.
                </>
              );
            })()}
          </p>
          {success.track && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="i-lucide-graduation-cap" />
              Track: {success.track}
            </p>
          )}
          {createAccount && (
            <p className="mt-2 text-white/80">
              <span className="inline-flex items-center gap-1 text-success">
                <span className="i-lucide-circle-check-big" />
                Account successfully created!
              </span> 
              {' '}You will be automatically redirected to your profile page. 
              If you are not redirected, please <a href="/profile?tab=bootcamps" className="text-accent hover:text-accent-lighter underline font-bold">
                click here
              </a> to view your bootcamp registration.
            </p>
          )}
        </div>

        <div className="grid gap-6 rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Payment Reference</span>
            <span className="text-lg font-mono tracking-[0.2em] text-white">{success.paymentReference}</span>
          </div>
          
          {/* Payment Status Badge */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Payment Status</span>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              success.status === 'paid' 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : success.status === 'processing' 
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-white/10 text-white/70'
            }`}>
              <span className={`${
                success.status === 'paid' 
                  ? 'i-lucide-check-circle' 
                  : success.status === 'processing' 
                  ? 'i-lucide-clock'
                  : 'i-lucide-circle-alert'
              }`} />
              {success.status === 'paid' 
                ? 'Paid' 
                : success.status === 'processing' 
                ? 'Processing'
                : 'Pending'}
            </span>
          </div>
          
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">Beneficiary</dt>
              <dd className="text-base text-white">{BANK_DETAILS.beneficiary}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">IBAN</dt>
              <dd className="font-mono text-base text-white">{BANK_DETAILS.iban}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">BIC / SWIFT</dt>
              <dd className="font-mono text-base text-white">{BANK_DETAILS.bic}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">Correspondent BIC</dt>
              <dd className="font-mono text-base text-white">{BANK_DETAILS.correspondentBic}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">Bank Name & Address</dt>
              <dd className="text-base text-white">{BANK_DETAILS.bankName}, {BANK_DETAILS.bankAddress}</dd>
            </div>
          </dl>
          <p className="text-xs text-white/70">
            Once your transfer is received, we&apos;ll verify it within 1-2 business days and confirm your enrollment by email.
            You can reply to that email with any receipts or questions.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/70">
            <p>We&apos;ve sent a confirmation email to {success.email}. If you don&apos;t see it, check your spam folder.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/bootcamps"
              className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/90 hover:border-white/70 hover:text-white transition"
            >
              Back to Bootcamps
            </a>
            <a
              href={mailtoHref}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-bg hover:bg-white/90 transition"
            >
              Email Our Team
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="Jane Doe"
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`w-full rounded-lg border ${
              fieldErrors.email ? 'border-error' : 'border-border/60'
            } bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30`}
            placeholder="you@example.com"
            disabled={submitting}
          />
          {fieldErrors.email && <p className="text-xs text-error">{fieldErrors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="+1 555 123 4567"
            disabled={submitting}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 mt-4 mb-2">
          <div className="flex items-center gap-3">
            <input
              id="createAccount"
              name="createAccount"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
              disabled={submitting}
            />
            <label htmlFor="createAccount" className="text-sm text-fg-muted">
              Create a ThinkForward account for future access to bootcamp materials and progress tracking
            </label>
          </div>
        </div>
        
        {createAccount && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border ${
                  fieldErrors.password ? 'border-error' : 'border-border/60'
                } bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30`}
                placeholder="Choose a secure password"
                disabled={submitting}
              />
              {fieldErrors.password ? (
                <p className="text-xs text-error">{fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-fg-muted">Password must be at least 8 characters and include letters and numbers</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-lg border ${
                  fieldErrors.confirmPassword ? 'border-error' : 'border-border/60'
                } bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30`}
                placeholder="Confirm your password"
                disabled={submitting}
              />
              {fieldErrors.confirmPassword && <p className="text-xs text-error">{fieldErrors.confirmPassword}</p>}
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="provider">Preferred Cloud Provider</label>
          <select
            id="provider"
            name="provider"
            defaultValue=""
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={submitting}
          >
            <option value="">Select one</option>
            <option value="azure">Microsoft Azure</option>
            <option value="aws">Amazon Web Services (AWS)</option>
            <option value="gcp">Google Cloud</option>
            <option value="multi">Multi-Cloud / No Preference</option>
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="inIt">Currently in IT industry?</label>
          <select
            id="inIt"
            name="inIt"
            defaultValue=""
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={submitting}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="current_role">If yes, current role / focus</label>
          <input
            id="current_role"
            name="current_role"
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. Support Engineer, SysAdmin"
            disabled={submitting}
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="experience">Years of experience</label>
          <select
            id="experience"
            name="experience"
            defaultValue=""
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={submitting}
          >
            <option value="">Select</option>
            <option value="0-1">0-1</option>
            <option value="1-3">1-3</option>
            <option value="3-5">3-5</option>
            <option value="5+">5+</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="goal">Primary goal</label>
          <select
            id="goal"
            name="goal"
            defaultValue=""
            className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={submitting}
          >
            <option value="">Select</option>
            <option value="career-change">Career change</option>
            <option value="skill-upgrade">Skill upgrade</option>
            <option value="certification">Certification prep</option>
            <option value="promotion">Promotion</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="exposure">Describe your current cloud / DevOps exposure</label>
        <textarea
          id="exposure"
          name="exposure"
          rows={4}
          className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Briefly describe tools, platforms, or scenarios you&apos;ve worked with."
          disabled={submitting}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted" htmlFor="notes">Anything else we should know?</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Scheduling constraints, certification targets, learning preferences, etc."
          disabled={submitting}
        />
      </div>
      <input type="hidden" name="track" value={hiddenTrackValue} readOnly />
      {error && (
        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-xs text-error">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-accent px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow hover:bg-accent-alt focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {submitting ? 'Submitting…' : 'Submit Registration'}
        </button>
        <a href="/bootcamps" className="text-xs font-medium text-fg-muted hover:text-fg transition">
          Back to Bootcamps
        </a>
      </div>
    </form>
  );
}