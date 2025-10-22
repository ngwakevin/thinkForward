'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Note: In App Router, it's next/navigation not next/router
import SignInForm from "../auth/signin/signInFormClient";

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
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-gray-500">
            You only need to sign in to access <strong>Dashboard</strong> and <strong>Profile</strong> pages. Most other content is public.
          </p>
        </div>

        <button
          onClick={() => signIn("azure-ad", { callbackUrl })}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Sign in with Microsoft
        </button>

        <div className="relative py-2 text-center text-xs text-gray-400">
          <span className="bg-white px-2">or</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 -z-10" />
        </div>

        {/* Email/password form */}
        <SignInForm />

        <div className="pt-2 flex justify-center gap-3 text-sm text-gray-500">
          <a href="/" className="underline">Home</a>
          <span>•</span>
          <a href="/bootcamps" className="underline">Bootcamps</a>
        </div>
      </div>
    </div>
  );
}