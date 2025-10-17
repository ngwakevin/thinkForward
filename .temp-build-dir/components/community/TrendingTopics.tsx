'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type TrendingThread = {
  id: string;
  title: string;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    posts: number;
  };
  user: {
    name: string | null;
    profile: {
      displayName: string | null;
    } | null;
  };
};

export default function TrendingTopics() {
  const [trendingThreads, setTrendingThreads] = useState<TrendingThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/community/threads?sort=popular&limit=5');
        if (response.ok) {
          const data = await response.json();
          setTrendingThreads(data);
        }
      } catch (error) {
        console.error('Error fetching trending topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 p-4">
        <h2 className="font-semibold mb-4">Trending Topics</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-bg-alt/50 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (trendingThreads.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <h2 className="font-semibold mb-4">Trending Topics</h2>
      <div className="space-y-4">
        {trendingThreads.map((thread) => (
          <Link 
            key={thread.id} 
            href={`/community/t/${thread.id}`}
            className="block p-2 -mx-2 rounded-md hover:bg-bg-alt/50"
          >
            <div className="text-sm font-medium line-clamp-1">{thread.title}</div>
            <div className="flex items-center justify-between mt-1 text-xs text-fg-muted">
              <span>{thread.category.name}</span>
              <span>{thread._count.posts} replies</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}