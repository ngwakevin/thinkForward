"use client";
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      // Force session refresh on window focus to ensure auth state is always up-to-date
      refetchOnWindowFocus={true}
      // Check session state more frequently (every 5 minutes)
      refetchInterval={300} 
      // Ensure the session is refreshed when needed
      refetchWhenOffline={false}
      // Use session proxy for consistent path handling on Azure
      basePath="/api/auth/session/proxy"
    >
      {children}
    </SessionProvider>
  );
}
