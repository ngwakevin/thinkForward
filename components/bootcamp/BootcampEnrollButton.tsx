// Example: How to add enrollment button to bootcamp detail pages
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BootcampEnrollButtonProps {
  bootcamp: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    cohort?: string;
    instructors?: string[];
    schedule?: string;
    location?: 'online' | 'hybrid' | 'in-person';
    topics?: string[];
  };
  isEnrolled?: boolean;
}

export default function BootcampEnrollButton({ bootcamp, isEnrolled = false }: BootcampEnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/user/bootcamps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bootcamp.id,
          title: bootcamp.title,
          description: bootcamp.description,
          status: 'enrolled',
          startDate: bootcamp.startDate,
          endDate: bootcamp.endDate,
          progress: 0,
          cohort: bootcamp.cohort || 'Current Cohort',
          instructors: bootcamp.instructors || [],
          schedule: bootcamp.schedule || 'TBD',
          location: bootcamp.location || 'online',
          topics: bootcamp.topics || [],
          completionCertificate: false,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setEnrolled(true);
        
        // Show success message
        alert(`Successfully enrolled in ${bootcamp.title}! Check your profile to view your bootcamp.`);
        
        // Optionally redirect to profile bootcamps tab
        // router.push('/profile?tab=bootcamps');
        
        // Or refresh the page to update enrollment status
        router.refresh();
      } else {
        throw new Error(data.error || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgress = () => {
    router.push('/profile?tab=bootcamps');
  };

  if (enrolled) {
    return (
      <button
        onClick={handleViewProgress}
        className="px-6 py-3 bg-accent/10 text-accent font-bold rounded-lg hover:bg-accent/20 transition-colors text-sm uppercase tracking-wide border border-accent/20"
      >
        View Progress
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  );
}

// Example usage in a bootcamp detail page:
/*
import BootcampEnrollButton from '@/components/bootcamp/BootcampEnrollButton';

export default function BootcampDetailPage({ bootcamp, userBootcamps }) {
  const isEnrolled = userBootcamps.some(b => b.id === bootcamp.id);

  return (
    <div>
      <h1>{bootcamp.title}</h1>
      <p>{bootcamp.description}</p>
      
      <BootcampEnrollButton 
        bootcamp={bootcamp}
        isEnrolled={isEnrolled}
      />
    </div>
  );
}
*/
