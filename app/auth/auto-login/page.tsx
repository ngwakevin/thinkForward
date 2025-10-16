'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AutoLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Initializing automatic login...');

  useEffect(() => {
    const email = searchParams.get('email');
    const callbackUrl = searchParams.get('callbackUrl') || '/profile?tab=bootcamps';
    const state = searchParams.get('state');
    const autoLogin = async () => {
      try {
        setStatus('Retrieving auto-login credentials...');
        
        // Get the password from localStorage - this was saved during registration
        const password = localStorage.getItem('autoLoginPassword');
        
        if (!email || !password) {
          setError('Missing required login information');
          return;
        }
        
        setStatus('Signing you in automatically...');
        
        // Attempt to sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        if (result?.ok) {
          setStatus('Login successful! Redirecting to your profile...');
          
          // Clear the temporary password from localStorage for security
          localStorage.removeItem('autoLoginPassword');
          
          // Use a small delay to ensure the session is established
          setTimeout(() => {
            window.location.href = callbackUrl;
          }, 1000);
        } else {
          setError(`Automatic login failed: ${result?.error || 'Unknown error'}`);
          
          // Fall back to regular login page after a delay
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
  }, [searchParams, router]);

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