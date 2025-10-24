"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/Button";

interface Bootcamp {
  id: string;
  bootcampId: string;
  bootcampName?: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  prerequisites: string[];
}

export default function BootcampRegistrationsSection() {
  const [registrations, setRegistrations] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Convert kebab-case IDs → Title Case names
  const formatBootcampName = (bootcampId: string, fallback?: string) => {
    if (!bootcampId && fallback) return fallback;
    if (!bootcampId) return "Cloud Foundation"; // default fallback
    return bootcampId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/profile/bootcamps");
        const data = await res.json();

        const normalized = (data.registrations || []).map((r: Bootcamp) => ({
          ...r,
          bootcampName:
            r.bootcampName ||
            formatBootcampName(r.bootcampId, "Cloud Foundation"),
        }));

        setRegistrations(normalized);
      } catch (err) {
        console.error("Failed to fetch bootcamp registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <p className="text-fg-muted text-center mt-6">
        Loading your registrations...
      </p>
    );
  }

  return (
    <section className="p-6 bg-bg-alt rounded-2xl shadow-lg border border-border">
      <h2 className="text-2xl font-semibold text-fg mb-6">
        Your Bootcamp Registrations
      </h2>

      {registrations.length === 0 ? (
        <div className="text-fg-muted text-center">
          <p>No bootcamp registrations found.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-accent text-bg hover:bg-accent-alt">
              <Link href="/bootcamps">Register for a Bootcamp</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-accent text-accent hover:bg-accent-soft"
            >
              <Link href="/self-paced">Explore Self-Paced Learning</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-accent text-accent hover:bg-accent-soft"
            >
              <Link href="/mentorship">Book a Mentorship</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {registrations.map((bootcamp) => {
            const startDate = dayjs(bootcamp.startDate);
            const daysUntilStart = startDate.diff(dayjs(), "day");

            return (
              <motion.div
                key={bootcamp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-bg border border-border shadow-md transition hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-fg">
                    <Link
                      href={`/bootcamps/${bootcamp.bootcampId}`}
                      className="hover:text-accent transition"
                    >
                      {bootcamp.bootcampName}
                    </Link>
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      bootcamp.status === "registered"
                        ? "bg-accent-soft text-accent"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {bootcamp.status}
                  </span>
                </div>

                <p className="text-fg-muted text-sm">
                  Payment:{" "}
                  <span
                    className={
                      bootcamp.paymentStatus.toLowerCase() === "paid"
                        ? "text-accent"
                        : "text-warning"
                    }
                  >
                    {bootcamp.paymentStatus}
                  </span>
                </p>

                <p className="text-fg-muted text-sm mt-1">
                  Start Date: {startDate.format("MMM D, YYYY")}
                </p>

                {daysUntilStart > 0 && (
                  <p className="text-sm text-accent mt-1">
                    Starts in {daysUntilStart} days ⏳
                  </p>
                )}

                {/* 🧠 Prerequisites */}
                {bootcamp.prerequisites?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {bootcamp.prerequisites.map((pre, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <span className="text-xs bg-border/40 text-fg-muted px-2 py-1 rounded-md cursor-help">
                            {pre}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-fg-muted">
                          Prerequisite: {pre}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
