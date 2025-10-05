import React from 'react';

type Tone = 'accent' | 'accentAlt' | 'neutral';
type Size = 'sm' | 'md';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  active?: boolean;
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[11px]',
  md: 'px-4 py-2 text-xs',
};

export const Chip: React.FC<ChipProps> = ({ tone = 'accent', size = 'sm', active = false, className = '', children, ...props }) => {
  const toneClasses =
    tone === 'accent'
      ? `bg-accent/10 text-accent outline outline-1 -outline-offset-1 ${active ? 'outline-accent/40' : 'outline-accent/30'}`
      : tone === 'accentAlt'
      ? `bg-accent-alt/10 text-accent-alt outline outline-1 -outline-offset-1 ${active ? 'outline-accent-alt/40' : 'outline-accent-alt/30'}`
      : `bg-bg text-fg outline outline-1 -outline-offset-1 outline-border/50`;
  return (
    <span className={`inline-flex items-center rounded-full ${sizes[size]} ${toneClasses} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Chip;
