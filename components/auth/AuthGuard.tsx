"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  adminOnly?: boolean;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects unauthenticated users to sign-in page
 * Also supports admin-only routes
 */
export function AuthGuard({ children, fallback, adminOnly = false }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Verify authentication on component mount
  useEffect(() => {
    if (status === 'loading') return;

    // Check if user is authenticated
    if (!session) {
      // Store the current URL to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    // Check if admin-only and user has admin role
    if (adminOnly) {
      // You would check for admin role in the session
      // This depends on your specific implementation of roles
      const isAdmin = (session.user as any)?.role === 'admin';
      
      if (!isAdmin) {
        // Redirect non-admin users to home or access denied page
        router.push('/');
        return;
      }
    }
    
    // Mark auth as checked to show content
    setAuthChecked(true);
    
    // Session expiry check - optional periodic refresh check
    const expiryCheck = setInterval(() => {
      // Check for session near expiry and refresh if needed
      // This depends on how your session implementation works
    }, 60000); // Check every minute
    
    return () => clearInterval(expiryCheck);
  }, [session, status, router, adminOnly]);
  
  // Show loading state while checking auth
  if (status === 'loading' || !authChecked) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  // Auth passed, render children
  return <>{children}</>;
}