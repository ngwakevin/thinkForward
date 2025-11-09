'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface RegistrationFormProps {
  defaultTrack?: string;
}

export default function SimpleRegistrationForm({ defaultTrack = 'Cloud Foundation' }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState(defaultTrack);
  const [createAccount, setCreateAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [registrationDetails, setRegistrationDetails] = useState<any>(null);

  const availableTracks = [
    'Cloud Foundation',
    'Cloud Engineering',
    'Cloud Solution Architect',
    'Cloud Networking',
    'DevOps Foundations'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call the new streamlined registration endpoint
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          track,
          createAccount,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }
      
      console.log('Registration successful:', result);
      setRegistrationDetails(result);
      setSuccess(true);
      
      // Handle auto-login if account created
      if (createAccount && result.auth) {
        // Store credentials for auto-login
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', result.auth.email);
        localStorage.setItem('registrationId', result.registration.id);
        if (result.userId) {
          localStorage.setItem('userId', result.userId);
        }
        if (result.bootcampId) {
          localStorage.setItem('bootcampId', result.bootcampId);
        }
        
        // Attempt direct sign-in
        try {
          console.log('Attempting auto-login...');
          
          // Redirect to auto-login page
          const params = new URLSearchParams();
          params.append('email', result.auth.email);
          params.append('callbackUrl', result.auth.callbackUrl || '/profile?tab=bootcamps');
          if (result.registration?.id) {
            params.append('registrationId', result.registration.id);
          }
          if (result.userId) {
            params.append('userId', result.userId);
          }
          
          window.location.href = `/auth/auto-login?${params.toString()}`;
        } catch (signInError) {
          console.error('Auto-login failed:', signInError);
        }
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
        <p>Thank you for registering for {track}.</p>
        {createAccount && (
          <p className="mt-2">
            Your account has been created and you will be redirected to your profile shortly.
          </p>
        )}
        {registrationDetails?.registration?.paymentReference && (
          <div className="mt-4 p-4 bg-white rounded border">
            <p className="font-semibold">Payment Reference:</p>
            <p className="font-mono">{registrationDetails.registration.paymentReference}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="track" className="block text-sm font-medium">
          Bootcamp Track
        </label>
        <select
          id="track"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          {availableTracks.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="createAccount"
          checked={createAccount}
          onChange={(e) => setCreateAccount(e.target.checked)}
          className="h-4 w-4 border-gray-300 rounded"
        />
        <label htmlFor="createAccount" className="ml-2 block text-sm">
          Create an account for me
        </label>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
    </form>
  );
}