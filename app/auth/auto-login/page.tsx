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
  const [debug, setDebug] = useState<Record<string, any>>({});

  useEffect(() => {
    const email = searchParams.get('email') || localStorage.getItem('userEmail');
    const callbackUrl = searchParams.get('callbackUrl') || localStorage.getItem('authCallbackUrl') || '/profile?tab=bootcamps';
    const registrationId = searchParams.get('registrationId') || localStorage.getItem('registrationId');
    const userId = searchParams.get('userId') || localStorage.getItem('userId');
    const bootcampId = localStorage.getItem('bootcampId');
    const registrationType = localStorage.getItem('registrationType');
    const state = searchParams.get('state');
    
    // Add these debugging logs with enhanced information
    console.log('Auto-login page initialized with:', {
      email,
      callbackUrl,
      registrationId,
      userId,
      bootcampId,
      registrationType,
      state,
      autoLoginPassword: localStorage.getItem('autoLoginPassword') ? 'exists' : 'missing',
      autoLoginAttempt: localStorage.getItem('autoLoginAttempt'),
      authTimestamp: localStorage.getItem('authTimestamp')
    });
    
    const autoLogin = async () => {
      try {
        setStatus('Retrieving auto-login credentials...');
        
        // Get the password from localStorage - this was saved during registration
        const password = localStorage.getItem('autoLoginPassword');
        
        // Store debug information for display
        const debugInfo = {
          email,
          hasPassword: !!password,
          registrationId,
          attempts,
          timestamp: new Date().toISOString(),
          csrfState: state || 'none'
        };
        setDebug(debugInfo);
        
        if (!email || !password) {
          console.error('Missing login credentials:', { hasEmail: !!email, hasPassword: !!password });
          setError('Missing required login information');
          return;
        }
        
        setStatus('Signing you in automatically...');
        console.log('Attempting sign-in with credentials provider');
        
        // Add some delay to ensure the session starts cleanly
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Attempt to sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl,
        });
        
        console.log('Sign-in result:', result);
        
        if (result?.ok) {
          setStatus('Login successful! Redirecting to your profile...');
          console.log('Auto-login successful, redirecting to:', callbackUrl);
          
          // Clear the temporary data from localStorage for security
          localStorage.removeItem('autoLoginPassword');
          localStorage.removeItem('autoLoginAttempt');
          
          // Store registration ID and other important data for profile page to use
          if (registrationId) {
            localStorage.setItem('lastRegistrationId', registrationId);
            localStorage.setItem('userRegistered', 'true');
            localStorage.setItem('registeredEmail', email);
            
            // Ensure we have the bootcamp info for proper linking
            const bootcampId = localStorage.getItem('bootcampId');
            if (bootcampId) {
              localStorage.setItem('lastBootcampId', bootcampId);
            }
            
            // Preserve the registration type for schema consistency
            const registrationType = localStorage.getItem('registrationType');
            if (registrationType) {
              localStorage.setItem('lastRegistrationType', registrationType);
            }
            
            // Store userId for linking if available
            const userId = localStorage.getItem('userId');
            if (userId) {
              localStorage.setItem('lastUserId', userId);
            }
          }
          
          // Use a delay with notification to ensure the session is established
          let countdown = 3;
          const interval = setInterval(() => {
            countdown--;
            setStatus(`Login successful! Redirecting in ${countdown}...`);
            if (countdown <= 0) {
              clearInterval(interval);
              window.location.href = callbackUrl;
            }
          }, 1000);
          
          return; // Exit early
        } else {
          console.error('Auto-login failed:', result?.error);
          setError(`Automatic login failed: ${result?.error || 'Unknown error'}`);
          
          // Try a different approach for login if we get an error
          if (attempts === 1) {
            // Try with a form submit approach as an alternative
            setStatus('Trying alternative login method...');
            try {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/auth/callback/credentials';
              form.style.display = 'none';
              
              const emailInput = document.createElement('input');
              emailInput.name = 'email';
              emailInput.value = email || '';
              form.appendChild(emailInput);
              
              const passwordInput = document.createElement('input');
              passwordInput.name = 'password';
              passwordInput.value = password || '';
              form.appendChild(passwordInput);
              
              const csrfInput = document.createElement('input');
              csrfInput.name = 'csrfToken';
              csrfInput.value = state || '';
              form.appendChild(csrfInput);
              
              document.body.appendChild(form);
              form.submit();
              return;
            } catch (formError) {
              console.error('Form submit approach failed:', formError);
            }
          }
          
          // Retry up to 3 times with increasing delays
          if (attempts < 3) {
            const delay = (attempts + 1) * 2;
            setStatus(`Login attempt ${attempts + 1}/4 failed. Retrying in ${delay} seconds...`);
            setTimeout(() => {
              setAttempts(prev => prev + 1);
              autoLogin();
            }, delay * 1000);
            return;
          }
          
          // Fall back to regular login page after all retries fail
          setStatus('All auto-login attempts failed. Redirecting to manual login...');
          setTimeout(() => {
            window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&email=${encodeURIComponent(email || '')}&justRegistered=true`;
          }, 3000);
        }
      } catch (err) {
        console.error('Auto-login error:', err);
        setError('Something went wrong during automatic login');
        setDebug(prev => ({ ...prev, error: String(err) }));
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
          
          {/* Debug information */}
          <div className="mt-8 pt-4 border-t border-border text-left text-xs text-fg-muted">
            <p className="font-semibold">Troubleshooting info:</p>
            <ul className="mt-2 space-y-1">
              <li>Attempt: {attempts + 1}/4</li>
              <li>Email: {debug.email || 'Not provided'}</li>
              <li>Password: {debug.hasPassword ? 'Provided' : 'Missing'}</li>
              <li>Registration ID: {debug.registrationId || 'Not provided'}</li>
              <li>Time: {debug.timestamp || new Date().toISOString()}</li>
              {debug.error && <li className="text-error">Error: {debug.error}</li>}
            </ul>
            <div className="mt-2">
              <button 
                className="text-xs text-accent underline"
                onClick={() => {
                  if (confirm('Do you want to try logging in manually instead?')) {
                    window.location.href = `/auth/signin?email=${encodeURIComponent(debug.email || '')}`;
                  }
                }}
              >
                Try manual login instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}