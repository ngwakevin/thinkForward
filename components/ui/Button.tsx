import React from 'react';

type Variant = 'primary' | 'outline' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean; // reserved for future link-as-button
}

const base = 'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-accent to-accent-alt text-white shadow hover:opacity-95',
  outline: 'bg-bg text-fg outline outline-1 -outline-offset-1 outline-border/60 hover:outline-accent/40 hover:text-accent',
  subtle: 'bg-accent/10 text-accent outline outline-1 -outline-offset-1 outline-accent/30 hover:bg-accent/15',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, type = 'button', ...props }) => {
  return (
    <button type={type} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
