'use client';

import { useState, useEffect } from 'react';

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
}

export default function BootcampRegistrationsSection({ userId }: { userId?: string }) {
  const [registrations, setRegistrations] = useState<BootcampRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBootcampRegistrations() {
      try {
        const response = await fetch('/api/profile/bootcamps');
        if (!response.ok) {
          throw new Error('Failed to fetch bootcamp registrations');
        }
        const data = await response.json();
        setRegistrations(data.registrations || []);
      } catch (err) {
        console.error('Error fetching bootcamp registrations:', err);
        setError('Could not load your bootcamp registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchBootcampRegistrations();
  }, [userId]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-accent border-r-transparent"></div>
        <p className="mt-2 text-sm text-fg-muted">Loading your bootcamp registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
        {error}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="text-5xl">🎓</div>
        <h3 className="text-lg font-medium">No bootcamp registrations found</h3>
        <p className="text-sm text-fg-muted">You haven't registered for any bootcamps yet.</p>
        <a
          href="/bootcamps"
          className="inline-block mt-4 px-5 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Explore Bootcamps
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Bootcamp Registrations</h3>
        <a
          href="/bootcamps"
          className="text-sm font-medium text-accent hover:underline"
        >
          View All Bootcamps
        </a>
      </div>

      <div className="space-y-4">
        {registrations.map((registration) => (
          <div
            key={registration.id}
            className="rounded-lg border border-border bg-bg-alt/50 p-4 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{registration.bootcampName}</h4>
                  <PaymentStatusBadge status={registration.paymentStatus} />
                </div>
                <div className="text-xs text-fg-muted">
                  <span className="font-medium">Registered:</span>{' '}
                  {new Date(registration.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs font-mono text-fg-muted">
                  <span className="font-medium">Payment Reference:</span>{' '}
                  {registration.paymentReference}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <a
                  href={`/bootcamps/${registration.bootcampId}`}
                  className="px-4 py-1 text-xs font-medium text-accent border border-accent/40 rounded-full hover:bg-accent/10 transition-colors"
                >
                  View Details
                </a>
                
                {registration.paymentStatus !== 'Confirmed' && (
                  <a
                    href={`/bootcamps/payment/${registration.id}`}
                    className="px-4 py-1 text-xs font-medium text-white bg-accent rounded-full hover:bg-accent/90 transition-colors"
                  >
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