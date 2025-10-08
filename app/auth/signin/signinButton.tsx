"use client";
import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('microsoft', { callbackUrl: '/' })}
      className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/90"
    >
      Sign in with Microsoft
    </button>
  );
}
