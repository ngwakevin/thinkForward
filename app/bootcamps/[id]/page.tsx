'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function BootcampDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bootcampId = params?.id as string;

  const [bootcamp, setBootcamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Check if user is already enrolled
  useEffect(() => {
    if (status === 'authenticated' && bootcampId) {
      const checkEnrollment = async () => {
        try {
          const res = await fetch('/api/user/bootcamps');
          if (res.ok) {
            const data = await res.json();
            const enrolled = data.bootcamps?.some((b: any) => b.id === bootcampId);
            setIsEnrolled(enrolled);
          }
        } catch (err) {
          console.error('Error checking enrollment:', err);
        }
      };
      checkEnrollment();
    }
  }, [status, bootcampId]);

  useEffect(() => {
    if (!bootcampId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/bootcamps/${bootcampId}`, { cache: 'no-store' });
        if (!res.ok) {
          if (res.status === 404) setMessage('Bootcamp not found');
          else setMessage('Failed to load bootcamp');
          return;
        }
        const data = await res.json();
        setBootcamp(data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load bootcamp');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bootcampId]);

  const handleRegister = async () => {
    if (status === 'unauthenticated') {
      const callbackUrl = typeof window !== 'undefined' ? window.location.href : '/dashboard';
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const name = session?.user?.name ?? '';
    const email = session?.user?.email ?? '';
    if (!email) {
      setMessage('Your account is missing an email; please update your profile.');
      return;
    }

    try {
      setRegistering(true);
      
      // Use the new user bootcamp enrollment API
      const res = await fetch('/api/user/bootcamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bootcamp.id,
          title: bootcamp.name || bootcamp.title,
          description: bootcamp.description || `${bootcamp.name} bootcamp program`,
          status: 'enrolled',
          startDate: bootcamp.startDate || 'TBD',
          endDate: bootcamp.endDate || 'TBD',
          progress: 0,
          cohort: bootcamp.cohort || 'Current Cohort',
          instructors: bootcamp.instructors || [],
          schedule: bootcamp.schedule || 'Schedule TBD',
          location: bootcamp.format || 'online',
          topics: bootcamp.topics || bootcamp.skills || [],
          completionCertificate: false,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setMessage('🎉 Enrollment successful! Check your profile to view your bootcamp.');
        setTimeout(() => {
          router.push('/profile?tab=bootcamps');
        }, 2000);
        return;
      }

      if (res.status === 200 && typeof data?.message === 'string') {
        setMessage(data.message);
        setTimeout(() => {
          router.push('/profile?tab=bootcamps');
        }, 2000);
        return;
      }

      setMessage(data?.error || 'Something went wrong');
    } catch (err) {
      console.error(err);
      setMessage('Failed to enroll');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading bootcamp...</div>;

  if (!bootcamp)
    return (
      <div className="p-8 text-center text-red-500">{message || 'Not found'}</div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{bootcamp.name}</h1>
      {bootcamp.description && <p className="text-gray-600 mb-6">{bootcamp.description}</p>}

      <div className="mb-4">
        <strong>Start Date:</strong>{' '}
        {bootcamp.startDate ? new Date(bootcamp.startDate).toLocaleDateString() : 'TBA'}
        {bootcamp.endDate && (
          <>
            <br />
            <strong>End Date:</strong>{' '}
            {new Date(bootcamp.endDate).toLocaleDateString()}
          </>
        )}
      </div>

      {message && (
        <p
          className={`mb-4 ${
            message.includes('🎉')
              ? 'text-green-600'
              : message.includes('sign in')
              ? 'text-blue-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      {isEnrolled ? (
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">✓ You are enrolled in this bootcamp</p>
          </div>
          <Button
            onClick={() => router.push('/profile?tab=bootcamps')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full"
          >
            View My Bootcamps
          </Button>
        </div>
      ) : (
        <Button
          disabled={registering}
          onClick={handleRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full"
        >
          {registering ? 'Enrolling...' : 'Enroll Now'}
        </Button>
      )}

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
