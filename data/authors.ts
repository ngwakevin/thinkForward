export interface Author {
  key: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string; // relative path or remote URL
  twitter?: string;
  github?: string;
  website?: string;
}

export const authors: Author[] = [
  {
    key: 'thinkforward',
    name: 'ThinkForward',
    role: 'Editorial Team',
    bio: 'Guiding cloud & DevOps talent with actionable learning paths, mentorship, and real delivery practices.',
    twitter: 'thinkforward',
  }
];

export function getAuthor(key?: string) {
  if (!key) return authors[0];
  return authors.find(a => a.key === key) || authors[0];
}
