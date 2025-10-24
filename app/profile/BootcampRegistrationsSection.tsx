"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

interface Bootcamp {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  paymentStatus: 'Pending' | 'Confirmed' | 'Rejected';
  prerequisites?: string[];
  joinedAt?: string;
}

export default function BootcampRegistrationsSection({ userId }: { userId?: string }) {
  const { status, data: session } = useSession();
  const [registrations, setRegistrations] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [forceReload, setForceReload] = useState(false);

  // Progress bar value for retry countdown
  const progress = ((5 - countdown) / 5) * 100;

  // Fetch bootcamp registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/bootcamps');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const rawList: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.registrations)
        ? data.registrations
        : [];

      // Normalize to Bootcamp shape for compatibility with existing API fields
      const list: Bootcamp[] = rawList.map((r) => ({
        id: r.id || r.bootcampId || r._id || '',
        name: r.name || r.bootcampName || 'Bootcamp',
        description: r.description || r.bootcampDescription || '',
        startDate: r.startDate || r.bootcampStartDate || r.createdAt || new Date().toISOString(),
        endDate: r.endDate || r.bootcampEndDate || r.bootcampFinishDate || new Date().toISOString(),
        paymentStatus: r.paymentStatus || 'Pending',
        prerequisites: r.prerequisites || [],
        joinedAt: r.joinedAt || r.createdAt || r.registrationDate || undefined,
      }));

      setRegistrations(list);
      setLoading(false);
    } catch (err) {
      console.error('[Bootcamp] Fetch error:', err);
      setTimeout(() => setForceReload((p) => !p), 3000);
    }
  }, []);

  // Initial & forced reload
  useEffect(() => {
    if (status === 'authenticated') fetchRegistrations();
  }, [status, forceReload, fetchRegistrations]);

  // Countdown for forced fetch
  useEffect(() => {
    if (loading && status === 'authenticated') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setForceReload((p) => !p);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, status]);

  const StatusBadge = ({ state }: { state: Bootcamp['paymentStatus'] }) => {
    if (state === 'Confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-accent text-bg shadow-sm">
          <CheckCircle2 size={14} /> Confirmed
        </span>
      );
    }
    if (state === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-warning text-bg shadow-sm">
          <Clock size={14} /> Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-danger text-bg shadow-sm">
        <XCircle size={14} /> Rejected
      </span>
    );
  };

  // Loading state: countdown + skeleton grid
  if (status === 'loading' || loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4 bg-bg-alt">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
                <GraduationCap size={18} /> Loading your registrations...
              </h2>
              <span className="text-xs text-fg-muted">Retrying in {countdown}s</span>
            </div>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-accent h-2"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-bg-alt shadow-lg overflow-hidden animate-pulse"
            >
              <div className="h-24 bg-border/50" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 bg-border/60 rounded" />
                <div className="h-4 w-full bg-border/50 rounded" />
                <div className="h-4 w-5/6 bg-border/50 rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-28 bg-border/60 rounded" />
                  <div className="h-8 w-28 bg-border/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!registrations.length) {
    return (
      <Card className="p-8 text-center bg-bg-alt border border-border rounded-xl shadow-lg">
        <CardContent>
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="text-fg-muted" size={28} />
            <h2 className="text-xl font-semibold text-fg">No Bootcamp Registrations Yet</h2>
            <p className="text-fg-muted text-sm max-w-prose">
              It looks like you haven&apos;t registered for a bootcamp yet. Explore upcoming programs and
              start your journey.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a
                href="/bootcamps"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-bg bg-accent rounded-md hover:bg-accent-alt transition-colors"
              >
                Browse Bootcamps <ArrowRight size={16} />
              </a>
              <a
                href="/mentorship"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent border border-accent rounded-md hover:bg-accent-soft transition-colors"
              >
                Book Mentorship
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Layout matching the provided mock
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Student info + registrations (2 cols on large) */}
        <Card className="lg:col-span-2 bg-bg-alt border border-border rounded-2xl shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-6">
            {/* Header: Student name + subheading */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-fg">
                {registrations[0]?.name || 'Bootcamp'}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-fg font-semibold text-lg">
              {/* Simple avatar with initial */}
              <div className="h-10 w-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                {(registrations[0]?.name || 'B').slice(0, 1)}
              </div>
              <span>Bootcamp register</span>
            </div>

            {/* Registration detail cards */}
            <div className="space-y-4">
              {registrations.map((bootcamp) => {
                const start = new Date(bootcamp.startDate).getTime();
                const end = new Date(bootcamp.endDate).getTime();
                const now = Date.now();
                const total = Math.max(end - start, 1);
                const elapsed = Math.max(Math.min(now - start, total), 0);
                const percent = Math.round((elapsed / total) * 100);
                const joined = bootcamp.joinedAt
                  ? new Date(bootcamp.joinedAt).toLocaleDateString()
                  : new Date(bootcamp.startDate).toLocaleDateString();

                return (
                  <div
                    key={bootcamp.id}
                    className="rounded-xl border border-border bg-bg shadow-sm p-5 lg:p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column */}
                      <div className="space-y-3">
                        <div className="text-xs uppercase tracking-wide text-fg-muted">Email</div>
                        <div className="text-fg font-medium">
                          {session?.user?.email || 'student@example.com'}
                        </div>

                        <div className="text-xs uppercase tracking-wide text-fg-muted mt-4">Joined</div>
                        <div className="text-fg">{joined}</div>
                      </div>

                      {/* Right column */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-fg">{bootcamp.name}</h3>

                        <div className="text-xs uppercase tracking-wide text-fg-muted">Start Date</div>
                        <div className="text-fg">
                          {new Date(bootcamp.startDate).toLocaleDateString()}
                        </div>

                        {/* Progress bar + status */}
                        <div className="mt-3">
                          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-accent transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-fg-muted text-sm">{percent}%</span>
                            <StatusBadge state={bootcamp.paymentStatus} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right: Promo panels */}
        <div className="space-y-6">
          <a
            href="/mentorship"
            className="block rounded-2xl overflow-hidden shadow-lg border border-border bg-gradient-to-br from-accent to-accent-alt/90 p-6 text-bg"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Book Mentorship</h3>
              <p className="text-sm/6 opacity-95 max-w-[26ch]">
                1:1 sessions with an expert mentor — get personalized guidance
              </p>
            </div>
          </a>

          <a
            href="/bootcamps"
            className="block rounded-2xl overflow-hidden shadow-lg border border-border bg-gradient-to-br from-accent-alt to-accent/90 p-6 text-bg"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Subscribe to
                <br /> Self-paced Course</h3>
              <p className="text-sm/6 opacity-95 max-w-[30ch]">
                Learn at your own pace with lifetime access to recorded lessons
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom primary CTA */}
      <div className="flex justify-center">
        <a
          href="/mentorship"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-accent text-bg hover:bg-accent-alt transition-colors shadow-md"
        >
          Book Mentorship
        </a>
      </div>
    </div>
  );
}