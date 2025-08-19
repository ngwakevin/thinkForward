/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'system-ui']
      },
      colors: {
        bg: 'var(--color-bg)',
        'bg-alt': 'var(--color-bg-alt)',
        fg: 'var(--color-fg)',
        'fg-muted': 'var(--color-fg-muted)',
        accent: 'var(--color-accent)',
        'accent-alt': 'var(--color-accent-alt)',
        'accent-soft': 'var(--color-accent-soft)',
        border: 'var(--color-border)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)'
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        md: '0 4px 12px -2px rgba(0,0,0,0.15)',
        glow: '0 0 0 3px var(--color-accent-soft)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
