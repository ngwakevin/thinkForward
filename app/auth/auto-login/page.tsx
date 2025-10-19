"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AutoLoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params?.get("email") ?? null;
  const password = params?.get("password") ?? null;

  useEffect(() => {
    const doLogin = async () => {
      if (!email || !password) return;

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.replace("/dashboard"); // or your target page
      } else {
        router.replace("/auth/signin?error=auto_login_failed");
      }
    };

    doLogin();
  }, [email, password, router]);

  return <p>Logging you in automatically...</p>;
}
