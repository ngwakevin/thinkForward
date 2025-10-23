"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Registration = {
  id: string;
  bootcampName?: string;
  createdAt?: string;
  registeredAt?: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bootcamps, setBootcamps] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchBootcamps = async () => {
      try {
        const res = await fetch(`/api/profile/bootcamps`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Our API returns { registrations: [...] }
        const regs: Registration[] = (data?.registrations || []).map((r: any) => ({
          id: r.id,
          bootcampName: r.bootcampName || r.track || r.bootcampId,
          // Prefer explicit registeredAt if present, fallback to createdAt
          registeredAt: r.registeredAt || r.createdAt,
          createdAt: r.createdAt,
        }));
        setBootcamps(regs);
      } catch (err) {
        console.error("Error fetching bootcamps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBootcamps();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {session?.user?.name || "User"}
        </h1>

        <p className="text-gray-600 mb-6">
          Below are the bootcamps you’ve registered for.
        </p>

        {bootcamps.length > 0 ? (
          <ul className="space-y-3">
            {bootcamps.map((b) => (
              <li
                key={b.id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{b.bootcampName || "Bootcamp"}</h3>
                  <p className="text-sm text-gray-500">
                    Registered on {new Date(b.registeredAt || b.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic">
            You have not registered for any bootcamps yet.
          </div>
        )}
      </div>
    </main>
  );
}