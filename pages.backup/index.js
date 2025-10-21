// This is a placeholder to satisfy Next.js Pages Router requirements
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the App Router homepage
    router.replace('/');
  }, [router]);
  
  return <div>Redirecting...</div>;
}
