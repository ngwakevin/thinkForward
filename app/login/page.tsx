'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("azure-ad", { callbackUrl: "/profile" })}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Microsoft
      </button>
    </div>
  );
}