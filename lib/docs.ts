import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface DocMeta {
  slug: string;
  title: string;
  description?: string;
  order: number;
  category?: string;
  difficulty?: 'foundation' | 'intermediate' | 'advanced';
  updated?: string;
  readingTime?: string;
  icon?: string;
  group?: string; // subgroup for Guides
}

export const CATEGORY_ORDER = ['Getting Started','Concepts','Guides','Playbooks','FAQ','Other'];
export const CATEGORY_INTROS: Record<string,string> = {
  'Getting Started': 'Fast onboarding: environment, mindset, first wins.',
  'Concepts': 'Core ideas & mental models that compound leverage.',
  'Guides': 'Practical, stepwise application to build and ship.',
  'Playbooks': 'Repeatable execution patterns for recurring scenarios.',
  'FAQ': 'Clarifications & common questions.',
  'Other': 'Additional reference material.'
};

export function inferCategory(rel: string): string {
  if (rel.startsWith('concepts/')) return 'Concepts';
  if (rel.startsWith('guides/')) return 'Guides';
  if (rel === 'quick-start') return 'Getting Started';
  if (rel === 'overview') return 'Getting Started';
  if (rel === 'faq') return 'FAQ';
  return 'Other';
}

export function loadDocs(): DocMeta[] {
  const base = path.join(process.cwd(), 'content', 'docs');
  if (!fs.existsSync(base)) return [];
  const entries: DocMeta[] = [];
  const walk = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) { walk(full); continue; }
      if (!file.endsWith('.mdx')) continue;
      const raw = fs.readFileSync(full, 'utf-8');
      const { data } = matter(raw);
      const rel = full.replace(base + path.sep, '').replace(/\\/g, '/').replace(/\.mdx$/, '');
      const meta = data as any;
      entries.push({
        slug: rel,
        title: meta.title || rel,
        description: meta.description,
        order: meta.order ?? 999,
        category: meta.category || inferCategory(rel),
        difficulty: meta.difficulty,
        updated: meta.updated,
        icon: meta.icon,
        readingTime: readingTime(raw).text,
        group: meta.group,
      });
    }
  };
  walk(base);
  return entries.sort((a,b)=> {
    if (a.order !== b.order) return a.order - b.order;
    // recent first if same order
    const ad = a.updated ? new Date(a.updated).getTime() : 0;
    const bd = b.updated ? new Date(b.updated).getTime() : 0;
    if (ad !== bd) return bd - ad;
    return a.title.localeCompare(b.title);
  });
}
