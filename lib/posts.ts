import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { slugify } from './slugify';

export interface PostFrontMatter {
  title: string;
  description?: string;
  date: string; // ISO string
  updated?: string; // ISO string for last modification
  tags?: string[];
  author?: string; // legacy
  authorKey?: string; // key into authors.ts
  coverImage?: string;
  draft?: boolean;
  canonical?: string;
  ogImage?: string;
  featured?: boolean;
  series?: string;
  seriesOrder?: number;
}

export interface PostMeta extends PostFrontMatter {
  slug: string;
  readingTime: string;
  headings?: { id: string; text: string; level: number }[]; // added
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readAllPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const walk = (dir: string): string[] => {
    return fs.readdirSync(dir).flatMap(file => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) return walk(full);
      if (file.endsWith('.mdx')) return [full];
      return [];
    });
  };
  return walk(BLOG_DIR);
}

function extractHeadings(content: string) {
  const lines = content.split(/\n/);
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const match = /^(##|###)\s+(.*)/.exec(line.trim());
    if (match) {
      const level = match[1] === '##' ? 2 : 3;
      const text = match[2].replace(/`/g, '').trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function getAllPostsMeta(includeDraft = false): PostMeta[] {
  return readAllPostFiles()
    .map(fullPath => {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      const fm = data as Partial<PostFrontMatter>;
      const slug = fullPath
        .replace(BLOG_DIR + path.sep, '')
        .replace(/\\/g, '/')
        .replace(/\.mdx$/, '');
      const stats = readingTime(content);
      const headings = extractHeadings(content);
      return {
        title: fm.title || slug,
        description: fm.description || '',
        date: fm.date || new Date().toISOString(),
        updated: fm.updated,
        tags: fm.tags || [],
        author: fm.author || 'ThinkForward',
        authorKey: fm.authorKey,
        coverImage: fm.coverImage,
        draft: fm.draft || false,
        canonical: fm.canonical,
        ogImage: fm.ogImage,
        featured: fm.featured || false,
        series: fm.series,
        seriesOrder: fm.seriesOrder,
        slug,
        readingTime: `${Math.max(1, Math.round(stats.minutes))} min read`,
        headings,
      } as PostMeta;
    })
    .filter(p => includeDraft || !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, slug + '.mdx');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontMatter>;
  const stats = readingTime(content);
  const headings = extractHeadings(content);
  const meta: PostMeta = {
    title: fm.title || slug,
    description: fm.description || '',
    date: fm.date || new Date().toISOString(),
    updated: fm.updated,
    tags: fm.tags || [],
    author: fm.author || 'ThinkForward',
    authorKey: fm.authorKey,
    coverImage: fm.coverImage,
    draft: fm.draft || false,
    canonical: fm.canonical,
    ogImage: fm.ogImage,
    featured: fm.featured || false,
    series: fm.series,
    seriesOrder: fm.seriesOrder,
    slug,
    readingTime: `${Math.max(1, Math.round(stats.minutes))} min read`,
    headings,
  };
  return { meta, content };
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const tags = new Set(current.meta.tags);
  return getAllPostsMeta()
    .filter(p => p.slug !== slug)
    .map(p => ({ p, score: (p.tags || []).reduce((acc, t) => acc + (tags.has(t) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.p);
}
