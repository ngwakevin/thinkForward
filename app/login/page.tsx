'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignInForm from "../auth/signin/signInFormClient";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [router, session, status]);

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Checking authentication...</div>;
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-14">
      <div className="rounded-3xl border border-border/70 bg-gradient-to-b from-bg-alt/80 to-bg/60 backdrop-blur-sm shadow-xl p-8 sm:p-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-sm text-fg-muted leading-relaxed">Enter your credentials or continue with a provider.</p>
        </div>
        <SignInForm />
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 text-xs text-fg-muted/70">
            <span>By signing in, you agree to our</span>
            <Link href={"/docs/privacy" as any} className="underline hover:text-fg">Privacy Policy</Link>
            <span>and</span>
            <Link href={"/docs/terms" as any} className="underline hover:text-fg">Terms of Service</Link>.
          </div>
          <div className="text-xs text-fg-muted flex flex-wrap items-center gap-2">
            <span className="opacity-70">Forgot your password?</span>
            <span className="text-fg-muted/60">Password reset coming soon</span>
          </div>
          <div className="text-xs text-fg-muted/80">
            Don&apos;t have an account? <Link href={"/auth/signup" as any} className="underline font-medium hover:text-fg">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}