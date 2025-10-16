'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AutoLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Initializing automatic login...');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const email = searchParams.get('email');
    const callbackUrl = searchParams.get('callbackUrl') || '/profile?tab=bootcamps';
    const registrationId = searchParams.get('registrationId') || localStorage.getItem('registrationId');
    const state = searchParams.get('state');
    
    const autoLogin = async () => {
      try {
        setStatus('Retrieving auto-login credentials...');
        
        // Get the password from localStorage - this was saved during registration
        const password = localStorage.getItem('autoLoginPassword');
        
        if (!email || !password) {
          console.error('Missing login credentials:', { hasEmail: !!email, hasPassword: !!password });
          setError('Missing required login information');
          return;
        }
        
        setStatus('Signing you in automatically...');
        console.log('Attempting sign-in with credentials provider');
        
        // Attempt to sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        if (result?.ok) {
          setStatus('Login successful! Redirecting to your profile...');
          console.log('Auto-login successful, redirecting to:', callbackUrl);
          
          // Clear the temporary data from localStorage for security
          localStorage.removeItem('autoLoginPassword');
          localStorage.removeItem('autoLoginAttempt');
          
          // Store registration ID for profile page to use
          if (registrationId) {
            localStorage.setItem('lastRegistrationId', registrationId);
          }
          
          // Use a small delay to ensure the session is established
          setTimeout(() => {
            window.location.href = callbackUrl;
          }, 1000);
        } else {
          console.error('Auto-login failed:', result?.error);
          setError(`Automatic login failed: ${result?.error || 'Unknown error'}`);
          
          // Retry up to 3 times with increasing delays
          if (attempts < 3) {
            setStatus(`Login attempt failed. Retrying in ${(attempts + 1) * 2} seconds...`);
            setTimeout(() => {
              setAttempts(prev => prev + 1);
              autoLogin();
            }, (attempts + 1) * 2000);
            return;
          }
          
          // Fall back to regular login page after all retries fail
          setTimeout(() => {
            window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&email=${encodeURIComponent(email || '')}`;
          }, 3000);
        }
      } catch (err) {
        console.error('Auto-login error:', err);
        setError('Something went wrong during automatic login');
      }
    };

    autoLogin();
  }, [searchParams, router, attempts]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-bg-alt rounded-xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-fg">Auto Login</h2>
          
          {!error ? (
            <div className="mt-4">
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-t-accent border-bg-alt animate-spin"></div>
                <p className="text-fg-muted">{status}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-error">
              <p>{error}</p>
              <p className="mt-2 text-sm">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}