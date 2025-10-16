"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Bootcamp {
  id: string;
  name: string;
  track: string;
  startDate: string;
  level: string;
  description?: string;
  price?: number;
  duration?: string;
}

export default function BootcampRegistrations() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const { data: session, status } = useSession();
  
  // Fetch bootcamps and user registrations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bootcamps
        const bootcampsResponse = await fetch('/api/bootcamps');
        const bootcampsData = await bootcampsResponse.json();
        setBootcamps(bootcampsData);
        
        // Fetch user registrations if user is logged in
        if (session?.user) {
          const registrationsResponse = await fetch('/api/profile/bootcamps');
          const registrationsData = await registrationsResponse.json();
          setUserRegistrations(registrationsData.registrations || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session]);
  
  // Handle bootcamp registration
  const registerForBootcamp = async (bootcamp: Bootcamp) => {
    if (!session) {
      // Redirect to login if user is not authenticated
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent('/bootcamps')}`;
      return;
    }
    
    setRegistering(bootcamp.id);
    
    try {
      const response = await fetch('/api/bootcamps/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          bootcampId: bootcamp.id,
          bootcampName: bootcamp.name,
          bootcampStartDate: bootcamp.startDate
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to register for bootcamp');
      }
      
      const data = await response.json();
      
      // Update user registrations
      setUserRegistrations([...userRegistrations, data.registration]);
      
      alert(`Successfully registered for ${bootcamp.name}!`);
    } catch (error) {
      console.error('Error registering for bootcamp:', error);
      alert('Failed to register for bootcamp. Please try again.');
    } finally {
      setRegistering(null);
    }
  };
  
  // Check if user is already registered for a bootcamp
  const isRegistered = (bootcampId: string) => {
    return userRegistrations.some(reg => reg.bootcampId === bootcampId);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <div className="text-center py-6">Loading bootcamps...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6">Available Bootcamps</h2>
      
      <div className="space-y-6">
        {bootcamps.map((bootcamp) => (
          <div 
            key={bootcamp.id}
            className="border border-border/60 rounded-lg p-6 bg-bg-alt/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl">{bootcamp.name}</h3>
                <p className="text-fg-muted">{bootcamp.track}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                {bootcamp.level}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Start Date:</span> {formatDate(bootcamp.startDate)}
              </div>
              {bootcamp.duration && (
                <div>
                  <span className="font-medium">Duration:</span> {bootcamp.duration}
                </div>
              )}
            </div>
            
            {bootcamp.description && (
              <p className="mt-4 text-sm text-fg-muted">{bootcamp.description}</p>
            )}
            
            <div className="mt-6 flex justify-end">
              {isRegistered(bootcamp.id) ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-xs font-medium text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Registered
                </span>
              ) : (
                <button
                  onClick={() => registerForBootcamp(bootcamp)}
                  disabled={registering === bootcamp.id}
                  className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {registering === bootcamp.id ? 'Registering...' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {bootcamps.length === 0 && (
          <div className="text-center py-12 bg-bg-alt/20 rounded-lg border border-border/40">
            <p>No bootcamps are currently available.</p>
            <p className="text-sm text-fg-muted mt-2">Please check back later for upcoming cohorts.</p>
          </div>
        )}
      </div>
      
      {userRegistrations.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold mb-6">Your Registrations</h2>
          
          <div className="space-y-4">
            {userRegistrations.map((reg) => (
              <div 
                key={reg.id}
                className="border border-border/60 rounded-lg p-4 bg-bg-alt/10 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{reg.bootcampName}</h3>
                  <p className="text-xs text-fg-muted mt-1">
                    Registration date: {formatDate(reg.createdAt || new Date().toISOString())}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    reg.paymentStatus === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reg.paymentStatus || 'Pending'}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    reg.completionStatus === 'Completed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reg.completionStatus || 'Not Started'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}