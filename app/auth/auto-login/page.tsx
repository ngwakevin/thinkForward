"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AutoLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const searchKey = params?.toString() ?? "";
  const [statusMessage, setStatusMessage] = useState("Logging you in automatically...");

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

    // Function to try JWT auth first
    const tryJwtAuth = async (email: string, password: string): Promise<boolean> => {
      try {
        setStatusMessage("Attempting JWT authentication...");
        console.log("[auto-login] Attempting JWT authentication for:", email);
        
        // Try to get a JWT token from the auto-login API
        const response = await fetch("/api/auth/signin/auto-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          // Add credentials mode for better cookie handling
          credentials: "same-origin"
        });
        
        // Log the response status for debugging
        console.log("[auto-login] Response status:", response.status);
        
        const data = await response.json();
        console.log("[auto-login] Response data:", JSON.stringify(data, null, 2));
        
        if (response.ok && data.token) {
          console.log("[auto-login] JWT authentication successful");
          // Store the JWT token - cookies are already set by the server
          // but also store in localStorage for client-side access
          localStorage.setItem("auth_token", data.token);
          
          // Verify token is stored properly
          console.log("[auto-login] Token stored in localStorage:", !!localStorage.getItem("auth_token"));
          
          // Check if cookies were set
          console.log("[auto-login] Cookies available:", document.cookie.includes("auth_token") || document.cookie.includes("refresh_token"));
          
          return true;
        }
        
        // If we have a redirectUrl but no token, it may be working differently than expected
        if (response.ok && data.redirectUrl) {
          console.log("[auto-login] Received redirect URL but no token:", data.redirectUrl);
          // Still consider this a success, but log it for debugging
          return true;
        }
        
        console.log("[auto-login] JWT authentication failed, will try NextAuth");
        return false;
      } catch (error) {
        console.error("[auto-login] JWT auth error:", error);
        return false;
      }
    };

    const doLogin = async () => {
      if (typeof window === "undefined") {
        return;
      }

      setStatusMessage("Initializing login process...");
      const currentParams = new URLSearchParams(searchKey);

      const emailParam = currentParams.get("email") ?? undefined;
      const passwordParam = currentParams.get("password") ?? undefined;
      const callbackParam = currentParams.get("callbackUrl") ?? undefined;
      const stateParam = currentParams.get("state") ?? undefined;

      const storedEmail = localStorage.getItem("userEmail") || undefined;
      const storedPassword = localStorage.getItem("autoLoginPassword") || undefined;
      const storedCallback = localStorage.getItem("authCallbackUrl") || undefined;

      const email = emailParam || storedEmail;
      const password = passwordParam || storedPassword;
      const callbackUrl = callbackParam || storedCallback || "/dashboard";

      if (!email || !password) {
        console.error("[auto-login] Missing email or password");
        setStatusMessage("Login failed: Missing email or password");
        clearAutoLoginState();
        setTimeout(() => {
          router.replace("/auth/signin?error=auto_login_missing_data");
        }, 1500);
        return;
      }
      
      console.log("[auto-login] Starting login process for:", email);

      // Try JWT auth first if available
      const jwtSuccess = await tryJwtAuth(email, password);
      
      if (jwtSuccess) {
        setStatusMessage("JWT authentication successful! Redirecting...");
        clearAutoLoginState();
        // Use a small delay to ensure token is processed
        setTimeout(() => {
          if (!cancelled) {
            router.replace(callbackUrl);
          }
        }, 1000);
        return;
      }
      
      // Fall back to NextAuth if JWT fails
      setStatusMessage("Trying NextAuth authentication...");

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl,
        });

        if (result?.ok) {
          setStatusMessage("Login successful! Redirecting...");
          clearAutoLoginState();
          const destination = result.url || callbackUrl || "/dashboard";
          if (!cancelled) {
            router.replace(destination);
          }
        } else {
          console.error("[auto-login] NextAuth signin failed:", result?.error);
          setStatusMessage("Login failed. Redirecting to login page...");
          clearAutoLoginState();
          if (!cancelled) {
            router.replace("/auth/signin?error=auto_login_failed");
          }
        }
      } catch (err) {
        console.error("[auto-login] Exception during login:", err);
        setStatusMessage("Login error occurred. Redirecting to login page...");
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
