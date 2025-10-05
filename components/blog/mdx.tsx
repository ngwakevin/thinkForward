import React from 'react';
import { Note, Tip, Warning, Danger } from './Callouts';

export const mdxComponents = {
  Highlight: (props: React.PropsWithChildren) => (
    <span className="text-accent font-semibold" {...props} />
  ),
  Note,
  Tip,
  Warning,
  Danger,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="rounded-lg border border-border/60 bg-bg-alt/60 p-4 overflow-x-auto text-sm" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="font-mono text-accent" {...props} />
  ),
};
