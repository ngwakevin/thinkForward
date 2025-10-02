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
  key: 'cloudegree',
  name: 'Cloudegree',
    role: 'Editorial Team',
    bio: 'Guiding cloud & DevOps talent with actionable learning paths, mentorship, and real delivery practices.',
  twitter: 'cloudegree',
  }
];

export function getAuthor(key?: string) {
  if (!key) return authors[0];
  return authors.find(a => a.key === key) || authors[0];
}
