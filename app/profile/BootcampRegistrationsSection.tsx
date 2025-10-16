'use client';

import { useState, useEffect } from 'react';
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
  // Note: userId can be either a user ID or email - the API will handle resolving it
  const [registrations, setRegistrations] = useState<BootcampRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [justRegistered, setJustRegistered] = useState<boolean>(false);
  const { data: session, status } = useSession();
  
  // Check if user just registered
  useEffect(() => {
    const autoLoginAttempt = localStorage.getItem('autoLoginAttempt');
    const regId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');
    
    // If we have these items in localStorage, the user likely just registered
    if (autoLoginAttempt && regId) {
      localStorage.setItem('justRegistered', 'true');
      setJustRegistered(true);
    }
  }, []);

  useEffect(() => {
    // Function to fetch registrations with exponential backoff
    async function fetchWithRetry(attempt = 1, maxAttempts = 5) {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching bootcamp registrations (attempt ${attempt} of ${maxAttempts})...`);
        
        // Get from localStorage if available from the registration process
        const email = localStorage.getItem('userEmail');
        const justRegistered = localStorage.getItem('autoLoginAttempt');
        const registrationId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');
        const localUserId = localStorage.getItem('userId');
        
        console.log('Registration data from localStorage:', { 
          email, 
          registrationId,
          userId: localUserId,
          justRegistered: !!justRegistered
        });
        
        let foundRegistrations: any[] = [];
        
        // First try the unauthenticated lookup API if we have a registration ID or email
        // This is useful especially right after registration when the session might not be fully established
        if (registrationId || email || localUserId) {
          try {
            console.log('Trying unauthenticated lookup API first');
            const params = new URLSearchParams();
            
            if (registrationId) params.append('id', registrationId);
            if (email) params.append('email', email);
            if (localUserId) params.append('userId', localUserId);
            
            const lookupUrl = `/api/bootcamps/lookup?${params.toString()}`;
            console.log('Lookup URL:', lookupUrl);
            
            const lookupResponse = await fetch(lookupUrl);
            if (lookupResponse.ok) {
              const lookupData = await lookupResponse.json();
              console.log('Lookup API response:', lookupData);
              
              if (lookupData.registrations?.length > 0) {
                console.log('Found registrations through lookup API');
                foundRegistrations = lookupData.registrations;
              }
            }
          } catch (lookupErr) {
            console.error('Error using lookup API:', lookupErr);
            // Continue to authenticated API if lookup fails
          }
        }
        
        // If we found registrations via the lookup API, use those
        if (foundRegistrations.length > 0) {
          console.log('Using registrations from lookup API:', foundRegistrations);
          setRegistrations(foundRegistrations);
          setLoading(false);
          
          // Clear the temporary data if we successfully found registrations
          if (justRegistered) {
            localStorage.removeItem('autoLoginAttempt');
          }
          return;
        }
        
        // If lookup API didn't return results, try the authenticated API
        console.log('Trying authenticated API');
        
        // Construct URL with parameters if available
        let url = '/api/profile/bootcamps';
        const params = new URLSearchParams();
        
        if (email) {
          params.append('email', email);
        }
        
        if (registrationId) {
          params.append('registrationId', registrationId);
        }
        
        if (localUserId) {
          params.append('userId', localUserId);
        }
        
        if (params.toString()) {
          url += '?' + params.toString();
        }
        
        console.log('Fetching registrations from URL:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Failed to fetch bootcamp registrations. Status:', response.status);
          
          // If this is the first attempt and we're getting an auth error,
          // it might be that the session isn't established yet, so retry
          if (attempt === 1 && (response.status === 401 || response.status === 403)) {
            console.log('Authentication error. Will retry after delay...');
            setTimeout(() => fetchWithRetry(attempt + 1, maxAttempts), 3000);
            return;
          }
          
          throw new Error(`Failed to fetch bootcamp registrations: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Bootcamp registrations data received:', data);
        
        if (!data || !Array.isArray(data.registrations)) {
          console.error('Unexpected data format:', data);
          throw new Error('Unexpected data format from the server');
        }
        
        if (data.registrations.length > 0) {
          setRegistrations(data.registrations);
          
          // Clear the temporary data if we successfully found registrations
          if (justRegistered) {
            localStorage.removeItem('autoLoginAttempt');
          }
          return;
        } else if (attempt < maxAttempts) {
          // If no registrations found and we have retries left, try again with increasing delay
          const delay = Math.min(attempt * attempt * 1000, 10000); // Exponential backoff with 10s cap
          console.log(`No registrations found. Retrying in ${delay/1000} seconds...`);
          setTimeout(() => fetchWithRetry(attempt + 1, maxAttempts), delay);
          return;
        }
        
        // If we've reached max attempts with no registrations, still set the empty array
        setRegistrations(data.registrations);
        
        // Clear localStorage data after all attempts to prevent stale data
        localStorage.removeItem('registrationId');
      } catch (err: any) {
        console.error('Error fetching bootcamp registrations:', err);
        setError(err.message || 'Failed to load bootcamp registrations');
        
        // If we have retries left, try again with exponential backoff
        if (attempt < maxAttempts) {
          const delay = Math.min(attempt * attempt * 1000, 10000); // Exponential backoff with 10s cap
          console.log(`Error occurred. Retrying in ${delay/1000} seconds...`);
          setTimeout(() => fetchWithRetry(attempt + 1, maxAttempts), delay);
        }
      } finally {
        if (attempt >= maxAttempts) {
          setLoading(false);
          // After all attempts, clear registration-specific data
          localStorage.removeItem('registrationId');
          localStorage.removeItem('lastRegistrationId');
        }
      }
    }

    // Only fetch data if the user is authenticated
    if (status === 'authenticated') {
      if (session) {
        fetchWithRetry();
      } else {
        console.error('Session is authenticated but session data is missing');
      }
    }
  }, [status, session, userId, retryCount]);

  // Function to manually trigger a retry
  const handleManualRetry = () => {
    console.log('Manually triggering retry');
    setRetryCount(prev => prev + 1);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading your registrations...</p>
        
        {/* Add retry button after a few seconds */}
        {retryCount > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            Retry attempt {retryCount} in progress...
          </p>
        )}
      </div>
    );
  }
  
  const handleRefresh = () => {
    console.log('Manually refreshing bootcamp registrations');
    setRetryCount(prev => prev + 1);
  };

  if (status === 'unauthenticated') {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="text-5xl">🔐</div>
        <h3 className="text-lg font-semibold">Authentication Required</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You need to be signed in to view your bootcamp registrations.
        </p>
      </div>
    );
  }

  if (error) {
    // Extract any registration-related data from localStorage for debugging
    const email = localStorage.getItem('userEmail');
    const registrationId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');
    const userId = localStorage.getItem('userId');
    const autoLoginAttempt = localStorage.getItem('autoLoginAttempt');
    
    return (
      <div className="py-6 space-y-4">
        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          <p className="font-semibold">Error loading bootcamp registrations</p>
          <p className="mt-1">{error}</p>
          
          <div className="mt-3 text-xs border-t border-error/20 pt-2">
            <p>If you just registered for a bootcamp, your registration may take a moment to appear.</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Now (Attempt #{retryCount + 1})
          </button>
          
          {(email || registrationId || userId) && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              <p className="mb-1 font-semibold">Debug Information:</p>
              {email && <p>Email: {email}</p>}
              {userId && <p>User ID: {userId}</p>}
              {registrationId && <p>Registration ID: {registrationId}</p>}
              {autoLoginAttempt && <p>Auto Login: Yes (timestamp: {autoLoginAttempt})</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (registrations.length === 0) {
    // Extract any registration-related data from localStorage for debugging
    const email = localStorage.getItem('userEmail');
    const registrationId = localStorage.getItem('lastRegistrationId') || localStorage.getItem('registrationId');
    const userId = localStorage.getItem('userId');
    const autoLoginAttempt = localStorage.getItem('autoLoginAttempt');
    const justRegistered = localStorage.getItem('justRegistered');
    
    return (
      <div className="py-10 text-center space-y-4">
        <div className="text-5xl">🎓</div>
        <h3 className="text-lg font-semibold">No Bootcamp Registrations Found</h3>
        
        {justRegistered ? (
          <div className="text-gray-600 max-w-md mx-auto space-y-2">
            <p>
              Thank you for registering! Your bootcamp registration is being processed and should appear here shortly.
            </p>
            <p className="text-sm">
              If you don&apos;t see your registration after a minute, please try refreshing this page.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 max-w-md mx-auto">
            You haven&apos;t registered for any bootcamps yet, or your registrations are still processing. 
            Explore our available bootcamps or refresh to check again.
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 justify-center">
          <a 
            href="/bootcamps" 
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Browse Bootcamps
          </a>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh (Attempt #{retryCount + 1})
          </button>
        </div>
        
        {(email || registrationId || userId || autoLoginAttempt) && (
          <div className="text-xs text-left bg-gray-50 p-3 rounded border border-gray-200 max-w-md mx-auto">
            <p className="font-semibold mb-1 text-center">Debug Information</p>
            <div className="space-y-1 text-gray-500">
              {session?.user?.email && <p>Session Email: {session.user.email}</p>}
              {session?.user && (session.user as any)?.id && <p>Session User ID: {(session.user as any).id}</p>}
              {email && <p>Stored Email: {email}</p>}
              {userId && <p>Stored User ID: {userId}</p>}
              {registrationId && <p>Registration ID: {registrationId}</p>}
              {autoLoginAttempt && <p>Auto Login: Yes ({new Date(parseInt(autoLoginAttempt)).toLocaleTimeString()})</p>}
              {justRegistered && <p>Just Registered: Yes</p>}
            </div>
          </div>
        )}
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