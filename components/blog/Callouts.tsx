import React from 'react';

interface CalloutProps extends React.PropsWithChildren { title?: string }

function base(cls: string, title: string | undefined, children: React.ReactNode) {
  return (
    <div className={cls}>
      {title && <div className="font-medium mb-1 tracking-tight">{title}</div>}
      <div className="text-sm leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

export const Note = ({ title = 'Note', children }: CalloutProps) =>
  base('my-6 rounded-lg border border-border/60 bg-bg-alt/40 p-4', title, children);

export const Tip = ({ title = 'Tip', children }: CalloutProps) =>
  base('my-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4', title, children);

export const Warning = ({ title = 'Warning', children }: CalloutProps) =>
  base('my-6 rounded-lg border border-warning/50 bg-warning/10 p-4', title, children);

export const Danger = ({ title = 'Important', children }: CalloutProps) =>
  base('my-6 rounded-lg border border-danger/50 bg-danger/10 p-4', title, children);
