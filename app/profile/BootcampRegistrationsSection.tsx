"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function BootcampRegistrationsSection({ userId: _userId }: { userId?: any } = {}) {
  const { data: session, status } = useSession();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [forceReload, setForceReload] = useState(false);

  // 🟩 Smooth animated progress
  const progress = ((5 - countdown) / 5) * 100;

  // 🟦 Debug: show session state
  useEffect(() => {
    console.log('[Bootcamp] Session status:', status, session);
  }, [status, session]);

  // 🟩 Safe API fetch
  const fetchRegistrations = useCallback(async (attempt = 1) => {
    try {
      console.log(`[Bootcamp] Fetching registrations (attempt ${attempt})...`);
      const res = await fetch('/api/profile/bootcamps', {
        headers: { 'Cache-Control': 'no-store' },
      });

      if (!res.ok) {
        console.warn('[Bootcamp] Fetch failed:', res.status);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('[Bootcamp] API data received:', data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.registrations)
        ? data.registrations
        : [];

      setRegistrations(list);
      setLoading(false);
    } catch (error) {
      console.error('[Bootcamp] Fetch error:', error);
      if (attempt < 3) {
        setTimeout(() => fetchRegistrations(attempt + 1), 2500);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // 🟩 Fetch only when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchRegistrations();
    }
  }, [status, forceReload, fetchRegistrations]);

  // 🟩 Countdown that triggers forced reload after 5 seconds
  useEffect(() => {
    if (loading && status === 'authenticated') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            console.log('[Bootcamp] Force reloading registrations');
            setForceReload((p) => !p);
            setCountdown(5);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, status]);

  // 🟦 UI States
  if (loading) {
    return (
      <Card className="p-4 text-center">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Loading your registrations...</h2>
          <p className="text-sm text-gray-500 mb-3">
            Retrying in <span className="font-bold">{countdown}</span> seconds...
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
      <Card className="p-4 text-center">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">No Bootcamp Registrations Found</h2>
          <p className="text-sm text-fg-muted mb-4">
            It looks like you haven&apos;t registered for a bootcamp yet.
          </p>
          <Button onClick={() => (window.location.href = '/bootcamps')}>
            View Available Bootcamps
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((bootcamp) => (
        <Card key={bootcamp.id || bootcamp._id} className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{bootcamp.bootcampName || bootcamp.name}</h3>
            <p className="text-fg-muted">{bootcamp.description || 'No description available.'}</p>
            <p className="text-sm text-fg-muted mt-2">
              Status: {bootcamp.completionStatus || 'Not Started'} | Payment: {bootcamp.paymentStatus || 'Pending'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}