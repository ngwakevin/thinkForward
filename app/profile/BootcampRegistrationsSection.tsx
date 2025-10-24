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

  // Modern redesigned layout - horizontal cards
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Bootcamp cards - stacked vertically */}
      <div className="space-y-6">
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
          
          const daysUntilStart = Math.ceil((start - now) / 86400000);
          const isUpcoming = daysUntilStart > 0;
          const isActive = now >= start && now <= end;

          return (
            <motion.div
              key={bootcamp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="group overflow-hidden border border-border bg-bg-alt hover:shadow-2xl transition-all duration-300 rounded-2xl">
                {/* Horizontal layout */}
                <div className="flex flex-col md:flex-row">
                  {/* Left: Gradient sidebar with bootcamp name */}
                  <div className="relative md:w-80 bg-gradient-to-br from-accent via-accent-alt to-accent/80 p-6 md:p-8 flex flex-col justify-between flex-shrink-0">
                    <div className="space-y-4">
                      <div className="h-20 w-20 rounded-2xl bg-bg/90 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-accent shadow-lg">
                        {bootcamp.name.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-bg leading-tight mb-2">
                          {bootcamp.name}
                        </h3>
                        {isUpcoming && (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-bg/90">
                            <Clock size={14} /> Starts in {daysUntilStart} days
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-bg/90">
                            <GraduationCap size={14} /> In Progress
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <StatusBadge state={bootcamp.paymentStatus} />
                    </div>
                  </div>

                  {/* Right: Card content */}
                  <CardContent className="flex-1 p-6 md:p-8 space-y-6">
                  {/* Description */}
                  {bootcamp.description && (
                    <p className="text-fg-muted text-sm leading-relaxed">
                      {bootcamp.description}
                    </p>
                  )}

                  {/* Key info grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-fg-muted uppercase tracking-wider">Joined</div>
                      <div className="text-fg font-semibold">{joined}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-fg-muted uppercase tracking-wider">Start Date</div>
                      <div className="text-fg font-semibold">
                        {new Date(bootcamp.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-fg-muted uppercase tracking-wider">End Date</div>
                      <div className="text-fg font-semibold">
                        {new Date(bootcamp.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-fg-muted uppercase tracking-wider">Your Email</div>
                      <div className="text-fg font-semibold text-sm truncate">
                        {session?.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-fg">Progress</span>
                      <span className="text-lg font-bold text-accent">{percent}%</span>
                    </div>
                    <div className="relative h-3 w-full bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-alt rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {bootcamp.prerequisites && bootcamp.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-fg-muted uppercase tracking-wider">Prerequisites</div>
                      <div className="flex flex-wrap gap-2">
                        {bootcamp.prerequisites.map((pre, i) => (
                          <span
                            key={`${bootcamp.id}-pre-${i}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-accent/10 text-accent border border-accent/20"
                          >
                            {pre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <a
                      href={`/bootcamps/${bootcamp.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-bg bg-accent rounded-lg hover:bg-accent-alt transition-colors shadow-sm"
                    >
                      View Details <ArrowRight size={16} />
                    </a>
                    <a
                      href="/mentorship"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-bg transition-colors"
                    >
                      Get Help
                    </a>
                  </div>
                </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions footer */}
      <Card className="border border-border bg-gradient-to-r from-bg-alt to-bg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-fg mb-2">Want to explore more?</h3>
              <p className="text-fg-muted text-sm">
                Discover additional bootcamps, self-paced courses, or book 1:1 mentorship sessions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/bootcamps"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bg bg-accent rounded-lg hover:bg-accent-alt transition-colors shadow-md"
              >
                <GraduationCap size={18} /> Browse Bootcamps
              </a>
              <a
                href="/mentorship"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-bg transition-colors"
              >
                Book Mentorship
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}