'use client';

import { useState, useEffect } from 'react';

type Tag = {
  id: string;
  name: string;
  slug: string;
};

export default function TagSelector() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/community/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return <div className="py-2 text-sm text-fg-muted">Loading tags...</div>;
  }

  if (tags.length === 0) {
    return null; // Don't show anything if there are no tags
  }

  return (
    <div className="mt-3">
      <label className="block text-sm text-fg-muted mb-2">Tags (optional)</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={`px-2 py-1 text-xs rounded-full ${
              selectedTags.includes(tag.id)
                ? 'bg-accent text-white'
                : 'bg-bg-alt text-fg-muted hover:bg-bg-alt/80'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <input
        type="hidden"
        name="tagIds"
        value={selectedTags.join(',')}
      />
    </div>
  );
}