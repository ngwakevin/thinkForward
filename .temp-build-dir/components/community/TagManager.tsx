'use client';

import { useState, useEffect } from 'react';

type Tag = {
  id: string;
  name: string;
  slug: string;
};

export default function TagManager({
  threadId,
  editable = false,
  initialTags = [],
}: {
  threadId: string;
  editable?: boolean;
  initialTags?: Tag[];
}) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch tags for this thread
  useEffect(() => {
    const fetchThreadTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/community/threads/${threadId}/tags`);
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('Error fetching thread tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tags.length === 0 && threadId) {
      fetchThreadTags();
    }
  }, [threadId, tags.length]);

  // Fetch available tags when editing
  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const response = await fetch('/api/community/tags');
        if (response.ok) {
          const data = await response.json();
          // Filter out tags that are already applied
          const tagIds = new Set(tags.map(t => t.id));
          setAvailableTags(data.filter((t: Tag) => !tagIds.has(t.id)));
        }
      } catch (error) {
        console.error('Error fetching available tags:', error);
      }
    };

    if (isEditing) {
      fetchAvailableTags();
    }
  }, [isEditing, tags]);

  // Save tags to thread
  const saveTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/community/threads/${threadId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tagIds: tags.map(t => t.id),
        }),
      });
      
      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a tag
  const addTag = () => {
    if (!selectedTagId) return;
    
    const tagToAdd = availableTags.find(t => t.id === selectedTagId);
    if (tagToAdd) {
      setTags([...tags, tagToAdd]);
      setAvailableTags(availableTags.filter(t => t.id !== selectedTagId));
      setSelectedTagId('');
    }
  };

  // Remove a tag
  const removeTag = (tagId: string) => {
    const tagToRemove = tags.find(t => t.id === tagId);
    if (tagToRemove) {
      setTags(tags.filter(t => t.id !== tagId));
      setAvailableTags([...availableTags, tagToRemove]);
    }
  };

  if (!editable && tags.length === 0) return null;

  return (
    <div className="mt-2">
      {!isEditing ? (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full bg-bg-alt text-fg-muted"
            >
              {tag.name}
            </span>
          ))}
          {editable && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-xs text-accent hover:underline"
            >
              {tags.length > 0 ? 'Edit tags' : 'Add tags'}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-md border border-border/60 p-3 space-y-3">
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map(tag => (
              <div
                key={tag.id}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-bg-alt"
              >
                {tag.name}
                <button onClick={() => removeTag(tag.id)} className="ml-1 text-fg-muted hover:text-fg">
                  ✕
                </button>
              </div>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-fg-muted">No tags selected</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              className="flex-1 rounded-md border border-border/60 bg-transparent px-3 py-1 text-sm"
            >
              <option value="">Select a tag</option>
              {availableTags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <button
              onClick={addTag}
              disabled={!selectedTagId}
              className="px-3 py-1 text-sm rounded-md bg-bg-alt/80 hover:bg-bg-alt disabled:opacity-50"
            >
              Add
            </button>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm rounded-md border border-border/60"
            >
              Cancel
            </button>
            <button
              onClick={saveTags}
              disabled={isLoading}
              className="px-3 py-1 text-sm rounded-md bg-accent text-white"
            >
              {isLoading ? 'Saving...' : 'Save Tags'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}