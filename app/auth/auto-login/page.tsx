"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function AutoLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // wait until session is loaded

    if (session) {
      // Already logged in, redirect to dashboard
      router.replace("/dashboard");
    } else {
      // Not logged in, trigger NextAuth signIn
      // You can specify provider (e.g., "google") or let user choose
      signIn("credentials", {
        callbackUrl: "/dashboard",
      });
    }
  }, [session, status, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-medium">Checking your session...</p>
    </div>
  );
}
