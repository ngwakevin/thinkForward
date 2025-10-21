"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AutoLoginPage() {
  const router = useRouter();

  useEffect(() => {
    async function autoLogin() {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (!session?.user) {
        // Auto sign-in using credentials if available
        const creds = JSON.parse(localStorage.getItem("lastSignupCreds") || "{}");
        if (creds.email && creds.password) {
          await signIn("credentials", {
            email: creds.email,
            password: creds.password,
            redirect: false,
          });
        }
      }
      router.push("/dashboard");
    }
    autoLogin();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-gray-300 text-sm">Attempting automatic sign-in...</p>
    </div>
  );
}
