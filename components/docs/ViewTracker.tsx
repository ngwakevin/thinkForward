"use client";

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    try {
      const views = JSON.parse(localStorage.getItem('docViews') || '{}');
      views[slug] = (views[slug] || 0) + 1;
      localStorage.setItem('docViews', JSON.stringify(views));
    } catch (e) {
      console.error('Failed to track view:', e);
    }
  }, [slug]);

  return null; // This component doesn't render anything
}