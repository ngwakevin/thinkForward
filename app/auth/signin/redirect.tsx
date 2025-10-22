'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get any existing query parameters to preserve them
    const queryParams = typeof window !== 'undefined' 
      ? window.location.search
      : '';

    // Redirect to the new login page
    router.replace(`/login${queryParams}`);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to login page...</p>
    </div>
  );
}