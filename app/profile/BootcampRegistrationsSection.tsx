"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface BootcampRegistration {
  id: string;
  paymentReference: string;
  createdAt: string;
  paymentStatus: 'Pending' | 'Confirmed' | 'Rejected';
  bootcampId: string;
  bootcampName: string;
  bootcampStartDate: string;
  userId: string;
  name?: string;
  email?: string;
  type?: string;
}

export default function BootcampRegistrationsSection({ userId }: { userId?: string }) {
  const [registrations, setRegistrations] = useState<BootcampRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [justRegistered, setJustRegistered] = useState<boolean>(false);

  const { data: session, status } = useSession();

  // --- 1️⃣ Detect if user just registered ---
  useEffect(() => {
    const autoLoginAttempt = localStorage.getItem('autoLoginAttempt');
    const regId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');
    if (autoLoginAttempt && regId) {
      setJustRegistered(true);
      localStorage.setItem('justRegistered', 'true');
    }
  }, []);

  // --- 2️⃣ Fetch registrations function with exponential backoff ---
  const fetchRegistrations = useCallback(async (attempt = 1, maxAttempts = 5) => {
    try {
      setLoading(true);
      setError(null);

      const effectiveUserId = userId || (session?.user as any)?.id || localStorage.getItem('userId');
      const email = localStorage.getItem('userEmail');
      const registrationId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');

      // --- 2a️⃣ Attempt lookup API first for just-registered users ---
      let foundRegistrations: BootcampRegistration[] = [];
      if (registrationId || email || effectiveUserId) {
        try {
          const params = new URLSearchParams();
          if (registrationId) params.append('id', registrationId);
          if (email) params.append('email', email);
          if (effectiveUserId) params.append('userId', String(effectiveUserId));

          const lookupUrl = `/api/bootcamps/lookup?${params.toString()}`;
          const lookupResp = await fetch(lookupUrl);
          if (lookupResp.ok) {
            const lookupData = await lookupResp.json();
            if (lookupData.registrations?.length) {
              foundRegistrations = lookupData.registrations;
            }
          }
        } catch (err) {
          console.warn('Lookup API failed, will try authenticated API', err);
        }
      }

      // --- 2b️⃣ If no lookup results, try authenticated API ---
      if (!foundRegistrations.length && status === 'authenticated') {
        const params = new URLSearchParams();
        if (effectiveUserId) params.append('userId', String(effectiveUserId));
        if (email) params.append('email', email);
        if (registrationId) params.append('registrationId', registrationId);

        const url = `/api/profile/bootcamps?${params.toString()}`;
        const resp = await fetch(url);
        if (!resp.ok) {
          if (attempt < maxAttempts && (resp.status === 401 || resp.status === 403)) {
            setTimeout(() => fetchRegistrations(attempt + 1, maxAttempts), 3000);
            return;
          }
          throw new Error(`Failed to fetch registrations: ${resp.statusText}`);
        }
        const data = await resp.json();
        if (data?.registrations?.length) {
          foundRegistrations = data.registrations;
        }
      }

      setRegistrations(foundRegistrations);

      // --- 2c️⃣ Clear temporary registration flags after successful fetch ---
      if (foundRegistrations.length && justRegistered) {
        localStorage.removeItem('autoLoginAttempt');
        localStorage.removeItem('lastRegistrationId');
        setJustRegistered(false);
      }

      if (!foundRegistrations.length && attempt < maxAttempts) {
        const delay = Math.min(attempt * attempt * 1000, 10000);
        setTimeout(() => fetchRegistrations(attempt + 1, maxAttempts), delay);
      }
    } catch (err: any) {
      console.error('Error fetching bootcamp registrations:', err);
      setError(err.message || 'Failed to load bootcamp registrations');
      if (attempt < 5) {
        const delay = Math.min(attempt * attempt * 1000, 10000);
        setTimeout(() => fetchRegistrations(attempt + 1, 5), delay);
      }
    } finally {
      if (attempt >= 5) setLoading(false);
    }
  }, [status, session, userId, justRegistered]);

  // --- 3️⃣ Trigger fetch when session is ready or retryCount changes ---
  useEffect(() => {
    if (status === 'authenticated') {
      fetchRegistrations();
    }
  }, [status, fetchRegistrations, retryCount]);

  const handleRefresh = () => setRetryCount(prev => prev + 1);

  if (status === 'loading' || loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading your registrations...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="py-10 text-center">
        <div className="text-5xl">🔐</div>
        <h3 className="text-lg font-semibold">Authentication Required</h3>
        <p className="text-gray-600">Sign in to view your bootcamp registrations.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 space-y-4">
        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          <p className="font-semibold">Error loading bootcamp registrations</p>
          <p>{error}</p>
        </div>
        <div className="text-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="text-5xl">🎓</div>
        <h3 className="text-lg font-semibold">No Bootcamp Registrations Found</h3>
        {justRegistered ? (
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for registering! Your registration is being processed. Refresh in a few seconds.
          </p>
        ) : (
          <p className="text-gray-600 max-w-md mx-auto">
            You haven&apos;t registered for any bootcamps yet.
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/bootcamps" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/80">
            Browse Bootcamps
          </a>
          <button onClick={handleRefresh} className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Bootcamp Registrations</h3>
        <a href="/bootcamps" className="text-sm font-medium text-accent hover:underline">
          View All Bootcamps
        </a>
      </div>
      <div className="space-y-4">
        {registrations.map((reg) => (
          <div key={reg.id} className="rounded-lg border border-border bg-bg-alt/50 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{reg.bootcampName}</h4>
                  <PaymentStatusBadge status={reg.paymentStatus} />
                </div>
                <div className="text-xs text-fg-muted">
                  <span className="font-medium">Registered:</span>{' '}
                  {new Date(reg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-xs font-mono text-fg-muted">
                  <span className="font-medium">Payment Reference:</span> {reg.paymentReference}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`/bootcamps/${reg.bootcampId}`} className="px-4 py-1 text-xs font-medium text-accent border border-accent/40 rounded-full hover:bg-accent/10 transition-colors">
                  View Details
                </a>
                {reg.paymentStatus !== 'Confirmed' && (
                  <a href={`/bootcamps/payment/${reg.id}`} className="px-4 py-1 text-xs font-medium text-white bg-accent rounded-full hover:bg-accent/90 transition-colors">
                    Complete Payment
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: 'Pending' | 'Confirmed' | 'Rejected' }) {
  let bgColor = 'bg-gray-500/20';
  let textColor = 'text-gray-300';
  let icon = 'i-lucide-circle-alert';
  let label = 'Pending';

  if (status === 'Confirmed') {
    bgColor = 'bg-emerald-500/20';
    textColor = 'text-emerald-300';
    icon = 'i-lucide-check-circle';
    label = 'Paid';
  } else if (status === 'Pending') {
    bgColor = 'bg-amber-500/20';
    textColor = 'text-amber-300';
    icon = 'i-lucide-clock';
    label = 'Pending';
  } else if (status === 'Rejected') {
    bgColor = 'bg-red-500/20';
    textColor = 'text-red-300';
    icon = 'i-lucide-x-circle';
    label = 'Rejected';
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${bgColor} ${textColor}`}>
      <span className={icon} />
      {label}
    </span>
  );
}