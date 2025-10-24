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
}

export default function BootcampRegistrationsSection({ userId }: { userId?: string }) {
  const { status } = useSession();
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {registrations.map((bootcamp) => {
        const startInMs = new Date(bootcamp.startDate).getTime() - Date.now();
        const startInDays = Math.ceil(startInMs / 86400000);

        return (
          <Card
            key={bootcamp.id}
            className="group overflow-hidden rounded-xl border border-border bg-bg-alt shadow-lg hover:shadow-xl transition-shadow will-change-transform"
          >
            {/* Decorative header */}
            <div className="h-24 bg-gradient-to-r from-accent to-accent-alt/90" />

            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-fg font-semibold text-xl leading-tight">{bootcamp.name}</h3>
                <StatusBadge state={bootcamp.paymentStatus} />
              </div>

              <p className="text-fg-muted text-sm">
                {bootcamp.description || 'No description available.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-fg-muted">
                  <Calendar size={14} />
                  {new Date(bootcamp.startDate).toLocaleDateString()} – {new Date(bootcamp.endDate).toLocaleDateString()}
                </span>
                {startInDays > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-fg-muted">
                    <Clock size={14} /> Starts in {startInDays} {startInDays === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>

              {/* Prerequisites chips */}
              {!!(bootcamp.prerequisites && bootcamp.prerequisites.length > 0) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {bootcamp.prerequisites!.map((pre, i) => (
                    <span
                      key={`${bootcamp.id}-pre-${i}`}
                      className="inline-flex items-center px-2 py-0.5 text-xs rounded-md border border-border text-fg-muted"
                    >
                      {pre}
                    </span>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`/bootcamps/${bootcamp.id}`}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-bg bg-accent rounded-md hover:bg-accent-alt transition-colors"
                >
                  View Details <ArrowRight size={16} />
                </a>
                <a
                  href="/bootcamps"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent border border-accent rounded-md hover:bg-accent-soft transition-colors"
                >
                  Explore More
                </a>
                <a
                  href="/mentorship"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-bg bg-accent-alt rounded-md hover:bg-accent transition-colors"
                >
                  Mentorship
                </a>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}