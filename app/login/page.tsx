'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Note: In App Router, it's next/navigation not next/router

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (status === 'authenticated' && session) {
      router.replace("/dashboard");
    }
  }, [router, session, status]);

  // Show loading state while checking session
  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Checking authentication...</div>;
  }

  // Get the callbackUrl from the query parameters (if a user was redirected here)
  const callbackUrl = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('callbackUrl') || '/dashboard'
    : '/dashboard';
    
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <button 
        onClick={() => signIn("azure-ad", { callbackUrl })}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Sign in with Microsoft
      </button>
      <p className="text-sm text-gray-500 mt-4">
        You need to sign in to access this content
      </p>
    </div>
  );
}