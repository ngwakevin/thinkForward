"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserMenuProvider } from "@/components/layout/UserMenuProvider";
import { SessionDebug } from "@/components/auth/SessionDebug";

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={true}
      refetchInterval={300}
      refetchWhenOffline={false}
    >
      <ThemeProvider>
        <UserMenuProvider>
          {children}
          {process.env.NODE_ENV !== "production" && (
            <div className="session-debug">
              <SessionDebug />
            </div>
          )}
        </UserMenuProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
