"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function AutoLoginPage() {
  const search = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [message, setMessage] = useState("Preparing auto-login…");

  useEffect(() => {
    // If already authenticated, go to callback or profile
    if (status === "authenticated") {
      const cb = (search?.get("callbackUrl")) || "/profile?tab=bootcamps";
      router.replace(cb);
      return;
    }
    if (status !== "unauthenticated") return; // wait until we know status

    const run = async () => {
      try {
        // Prefer query params, fallback to localStorage (set by registration flow)
  const email = (search?.get("email")) || localStorage.getItem("userEmail") || "";
  const password = (search?.get("password")) || localStorage.getItem("autoLoginPassword") || "";
  const callbackUrl = (search?.get("callbackUrl")) || localStorage.getItem("authCallbackUrl") || "/profile?tab=bootcamps";

        if (!email || !password) {
          setMessage("Missing credentials for auto-login. Redirecting to login…");
          setTimeout(() => router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`), 600);
          return;
        }

        setMessage("Signing you in…");
        const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });

        if (res && !res.error) {
          setMessage("Login successful. Redirecting…");
          setTimeout(() => router.replace(callbackUrl), 800);
        } else {
          setMessage("Auto-login failed. Redirecting to login…");
          setTimeout(() => router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`), 800);
        }
      } catch (e) {
        setMessage("Auto-login encountered an error. Redirecting…");
        setTimeout(() => router.replace("/login"), 800);
      }
    };

    // small delay to allow cookies/storage to settle
    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [status, router, search]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-sm text-fg-muted">{message}</div>
    </div>
  );
}
