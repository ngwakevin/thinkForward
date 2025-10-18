"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {session?.user?.name || "Guest"}!
      </h1>
      <p className="mt-2">You are logged in using NextAuth.</p>
    </div>
  );
}