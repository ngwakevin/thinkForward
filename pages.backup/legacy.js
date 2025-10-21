import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to App Router
    router.replace('/');
  }, []);
  
  return <div>Redirecting to new app...</div>;
}