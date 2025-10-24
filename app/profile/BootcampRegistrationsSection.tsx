"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const [registrations, setRegistrations] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [forceReload, setForceReload] = useState(false);

  // Progress bar value
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

  if (status === 'loading' || loading) {
    return (
      <Card className="p-4 text-center bg-bg-alt">
        <CardContent>
          <h2 className="text-lg font-semibold text-fg mb-2">Loading your registrations...</h2>
          <p className="text-fg-muted text-sm mb-3">
            Retrying in <span className="font-bold">{countdown}</span> seconds...
          </p>
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-accent h-2"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!registrations.length) {
    return (
      <Card className="p-4 text-center bg-bg-alt">
        <CardContent>
          <h2 className="text-lg font-semibold text-fg mb-2">No Bootcamp Registrations Found</h2>
          <p className="text-fg-muted text-sm mb-4">
            It looks like you haven&apos;t registered for a bootcamp yet.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => (window.location.href = '/bootcamps')}>View Available Bootcamps</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((bootcamp) => {
        const startInMs = new Date(bootcamp.startDate).getTime() - Date.now();
        const startInDays = Math.ceil(startInMs / 86400000);

        return (
          <Card key={bootcamp.id} className="bg-bg-alt border border-border rounded-lg shadow-md">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-fg font-semibold text-lg">{bootcamp.name}</h3>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    bootcamp.paymentStatus === 'Confirmed'
                      ? 'bg-accent text-bg'
                      : bootcamp.paymentStatus === 'Pending'
                      ? 'bg-warning text-bg'
                      : 'bg-danger text-bg'
                  }`}
                >
                  {bootcamp.paymentStatus}
                </span>
              </div>

              <p className="text-fg-muted text-sm">{bootcamp.description || 'No description available.'}</p>

              <div className="flex flex-wrap gap-2 items-center">
                {!!(bootcamp.prerequisites && bootcamp.prerequisites.length > 0) && (
                  <div className="group relative cursor-pointer">
                    <span className="text-accent text-xs font-medium">Prerequisites ⚡</span>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 text-xs text-fg bg-bg-alt border border-border rounded shadow-lg z-10">
                      {(bootcamp.prerequisites || []).join(', ')}
                    </div>
                  </div>
                )}

                {startInDays > 0 && (
                  <span className="text-fg-muted text-xs">
                    Starts in {startInDays} {startInDays === 1 ? 'day' : 'days'}
                  </span>
                )}

                <a
                  href={`/bootcamps/${bootcamp.id}`}
                  className="px-3 py-1 text-xs font-medium text-bg bg-accent rounded hover:bg-accent-alt transition-colors"
                >
                  View Details
                </a>

                <a
                  href="/bootcamps"
                  className="px-3 py-1 text-xs font-medium text-accent border border-accent rounded hover:bg-accent-soft transition-colors"
                >
                  Register More / Self-Learning
                </a>

                <a
                  href="/mentorship"
                  className="px-3 py-1 text-xs font-medium text-bg bg-accent-alt rounded hover:bg-accent transition-colors"
                >
                  Book Mentorship
                </a>
              </div>

              <p className="text-fg-muted text-xs font-mono mt-2">
                Bootcamp Date: {new Date(bootcamp.startDate).toLocaleDateString()} –{' '}
                {new Date(bootcamp.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}