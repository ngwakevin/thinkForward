"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Bootcamp {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBootcamps = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/bootcamps?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to load bootcamps");
        const data = await res.json();
        setBootcamps(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBootcamps();
  }, [session?.user?.email]);

  if (status === "loading" || loading)
    return <p className="text-center mt-10">Loading your dashboard...</p>;

  if (!session)
    return (
      <div className="flex flex-col items-center mt-10">
        <p>Please sign in to view your dashboard.</p>
        <Link href="/login" className="text-blue-600 underline mt-2">
          Go to Sign In
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
  <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name || session?.user?.email}</h1>
  <p className="text-gray-500 mb-8">Email: {session?.user?.email}</p>

      <h2 className="text-2xl font-semibold mb-4">Your Registered Bootcamps</h2>

      {bootcamps.length === 0 ? (
        <p className="text-gray-500">You haven’t registered for any bootcamps yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bootcamps.map((bootcamp) => (
            <li key={bootcamp.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{bootcamp.name}</p>
                  <p className="text-sm text-gray-500">
                    {bootcamp.startDate} → {bootcamp.endDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    bootcamp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {bootcamp.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link
          href="/bootcamps"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Browse Bootcamps
        </Link>
      </div>
    </div>
  );
}