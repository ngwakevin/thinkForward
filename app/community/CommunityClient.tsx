'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type ThreadTag = {
  tag: Tag;
};

type Thread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: Category;
  user: {
    id: string;
    name: string;
    profile?: {
      displayName: string | null;
      avatarUrl: string | null;
    };
  };
  posts: { id: string }[];
  tags?: ThreadTag[];
};

import TrendingTopics from '../../components/community/TrendingTopics';

export default function CommunityClient({
  initialCategories,
  initialThreads,
}: {
  initialCategories: Category[];
  initialThreads: Thread[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Fetch threads based on filters
  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (selectedCategory && selectedCategory !== 'all') {
          params.set('categoryId', selectedCategory);
        }
        
        const response = await fetch(`/api/community/threads?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch threads');
        
        let fetchedThreads = await response.json();
        
        // Client-side sorting
        if (sortBy === 'recent') {
          fetchedThreads.sort((a: Thread, b: Thread) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === 'popular') {
          fetchedThreads.sort((a: Thread, b: Thread) => 
            (b.posts?.length || 0) - (a.posts?.length || 0)
          );
        }
        
        setThreads(fetchedThreads);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [searchTerm, sortBy, selectedCategory]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (sortBy && sortBy !== 'recent') params.set('sort', sortBy);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    
    const queryStr = params.toString();
    // Update the URL without a full navigation/refresh
    window.history.replaceState(
      {}, 
      '', 
      queryStr ? `/community?${queryStr}` : '/community'
    );
  }, [searchTerm, sortBy, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Community</h1>
          <p className="text-fg-muted">Learn together. Ask questions. Share solutions.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Search and Filters */}
          <div className="rounded-xl border border-border/60 p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions..."
                className="flex-1 rounded-md border border-border/60 bg-transparent px-3 py-2"
              />
              <button type="submit" className="rounded-md bg-accent px-4 py-2 text-white">
                Search
              </button>
            </form>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-fg-muted">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-border/60 bg-transparent px-3 py-1 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-fg-muted">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-border/60 bg-transparent px-3 py-1 text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <section>
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/community/c/${c.slug}`}
                  className="rounded-xl border border-border/60 p-4 hover:bg-bg-alt/60"
                >
                  <div className="font-medium">{c.name}</div>
                  {c.description && (
                    <div className="text-xs text-fg-muted mt-1 line-clamp-2">
                      {c.description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Threads Section */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">
                {searchTerm ? 'Search Results' : 'Threads'}
              </h2>
              {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory) && (
                <Link
                  href={`/community/c/${categories.find(c => c.id === selectedCategory)?.slug}`}
                  className="text-sm text-accent"
                >
                  View Category Page
                </Link>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                <p className="mt-2 text-fg-muted">Loading threads...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-border/60 p-4">
                <p className="text-fg-muted">No threads found.</p>
                <Link href="/community" className="text-accent mt-2 inline-block">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                {threads.map((t) => (
                  <Link
                    key={t.id}
                    href={`/community/t/${t.id}`}
                    className="block p-4 hover:bg-bg-alt/60"
                  >
                    <div className="flex justify-between">
                      <div className="text-sm text-fg-muted">{t.category.name}</div>
                      <div className="text-xs text-fg-muted">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-sm text-fg-muted line-clamp-2 mt-1">{t.content}</div>
                    
                    {/* Tags */}
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.tags.map((tt: any) => (
                          <span 
                            key={tt.tag.id}
                            className="px-2 py-0.5 text-xs rounded-full bg-bg-alt text-fg-muted"
                          >
                            {tt.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-fg-muted">
                        by {t.user?.profile?.displayName || t.user?.name || 'Member'}
                      </div>
                      <div className="text-xs text-fg-muted">
                        {t.posts.length} {t.posts.length === 1 ? 'reply' : 'replies'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <TrendingTopics />
          
          <div className="rounded-xl border border-border/60 p-4">
            <h2 className="font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-sm text-accent hover:underline">
                  All Discussions
                </Link>
              </li>
              <li>
                <Link href="/mentoring" className="text-sm text-accent hover:underline">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-accent hover:underline">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-border/60 p-4 bg-bg-alt/30">
            <h2 className="font-semibold mb-3">Community Guidelines</h2>
            <ul className="text-sm space-y-2 text-fg-muted">
              <li>• Be respectful and inclusive</li>
              <li>• Share knowledge generously</li>
              <li>• Provide context in your questions</li>
              <li>• Keep discussions on topic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}