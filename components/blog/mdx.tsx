import React from 'react';
import { Note, Tip, Warning, Danger } from './Callouts';
import dynamic from 'next/dynamic';

const CopyButton = dynamic(() => import('./CopyButton').then(m => m.CopyButton), { ssr: false });

export const mdxComponents = {
  Highlight: (props: React.PropsWithChildren) => (
    <span className="text-accent font-semibold" {...props} />
  ),
  Note,
  Tip,
  Warning,
  Danger,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    const text = typeof props.children === 'string' ? props.children : (React.isValidElement(props.children) && typeof props.children.props.children === 'string' ? props.children.props.children : '');
    return (
      <div className="relative group">
        <pre className="rounded-lg border border-border/60 bg-bg-alt/60 p-4 overflow-x-auto text-sm" {...props} />
        <CopyButton code={text} />
      </div>
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="font-mono text-accent" {...props} />
  ),
};
