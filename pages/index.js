import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyHome() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to App Router home page
    router.replace('/');
  }, []);
  
  return null; // This page won't be shown as it redirects
}