// This is a placeholder to satisfy Next.js Pages Router requirements
const { useEffect } = require('react');
const { useRouter } = require('next/router');

function LegacyPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the App Router homepage
    router.replace('/');
  }, [router]);
  
  return <div>Redirecting...</div>;
}

module.exports = LegacyPage;
