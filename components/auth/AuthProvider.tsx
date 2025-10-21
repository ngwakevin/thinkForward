"use client";
import type { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children, session }: { children: ReactNode; session?: Session | null }) {
  return (
    <SessionProvider 
      session={session}
      // Force session refresh on window focus to ensure auth state is always up-to-date
      refetchOnWindowFocus={true}
      // Check session state more frequently (every 5 minutes)
      refetchInterval={300} 
      // Ensure the session is refreshed when needed
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
