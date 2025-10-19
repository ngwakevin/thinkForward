"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AutoLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const searchKey = params?.toString() ?? "";

  useEffect(() => {
    let cancelled = false;

    const clearAutoLoginState = () => {
      if (typeof window === "undefined") return;
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("autoLoginPassword");
      localStorage.removeItem("autoLoginAttempt");
      localStorage.removeItem("registrationId");
      localStorage.removeItem("userId");
      localStorage.removeItem("bootcampId");
      localStorage.removeItem("registrationType");
      localStorage.removeItem("authTimestamp");
      localStorage.removeItem("authCallbackUrl");
    };

    const doLogin = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const currentParams = new URLSearchParams(searchKey);

      const emailParam = currentParams.get("email") ?? undefined;
      const passwordParam = currentParams.get("password") ?? undefined;
      const callbackParam = currentParams.get("callbackUrl") ?? undefined;

      const storedEmail = localStorage.getItem("userEmail") || undefined;
      const storedPassword = localStorage.getItem("autoLoginPassword") || undefined;
      const storedCallback = localStorage.getItem("authCallbackUrl") || undefined;

      const email = emailParam || storedEmail;
      const password = passwordParam || storedPassword;
      const callbackUrl = callbackParam || storedCallback || "/dashboard";

      if (!email || !password) {
        clearAutoLoginState();
        router.replace("/auth/signin?error=auto_login_missing_data");
        return;
      }

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl,
        });

        if (result?.ok) {
          clearAutoLoginState();
          const destination = result.url || callbackUrl || "/dashboard";
          if (!cancelled) {
            router.replace(destination);
          }
        } else {
          clearAutoLoginState();
          if (!cancelled) {
            router.replace("/auth/signin?error=auto_login_failed");
          }
        }
      } catch (err) {
        clearAutoLoginState();
        if (!cancelled) {
          router.replace("/auth/signin?error=auto_login_exception");
        }
      }
    };

    doLogin();
    return () => {
      cancelled = true;
    };
  }, [router, searchKey]);

  return <p>Logging you in automatically...</p>;
}
