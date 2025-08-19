import Link from 'next/link';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Wordmark } from '../brand/Wordmark';

// New grouped link data aligned with reference design (developers removed)
const productLinks = [
  { href: '/products', label: 'Tracks Overview' },
  { href: '/bootcamps', label: 'Bootcamps' },
  { href: '/platform', label: 'Platform' },
  { href: '/mentoring', label: 'Mentoring' },
  { href: '/events', label: 'Events' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/docs/faq', label: 'FAQ' },
];
const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  // Guides & Support removed previously
];
// developerLinks removed per request

function CardColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-sm hover:bg-white/[0.045] transition">
      <h4 className="mb-5 text-sm font-semibold tracking-wide text-emerald-400/90">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(l => (
          <li key={l.href}>
            <Link
              href={l.href as any}
              className="text-white/70 hover:text-white transition inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 rounded-sm"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-40 bg-[#062a3a] text-white/90">
      <div className="mx-auto max-w-7xl px-6 pt-24">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 rounded-sm">
            <Wordmark className="text-3xl" />
          </Link>
          <p className="mt-4 text-sm text-white/50 max-w-md mx-auto">Pragmatic acceleration for Cloud & DevOps skills.</p>
        </div>

        {/* Columns (two) */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          <CardColumn title="Products" links={productLinks} />
          <CardColumn title="Company" links={companyLinks} />
        </div>

        {/* Action buttons */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <Link href="/support" className="inline-flex items-center rounded-full border border-emerald-400/40 px-6 py-2 text-sm font-medium hover:bg-emerald-400/10 hover:border-emerald-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50">
            Support
          </Link>
          <Link href="/contact" className="inline-flex items-center rounded-full border border-emerald-400/40 px-6 py-2 text-sm font-medium hover:bg-emerald-400/10 hover:border-emerald-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50">
            Contact
          </Link>
          <Link href="#" className="inline-flex items-center rounded-full border border-emerald-400/40 px-6 py-2 text-sm font-medium hover:bg-emerald-400/10 hover:border-emerald-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50">
            Login
          </Link>
          <div className="inline-flex items-center rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-medium">
            <ThemeToggle />
          </div>
        </div>

        {/* Social */}
        <div className="mt-14 flex flex-col items-center gap-6">
          <div className="flex gap-5 text-white/60">
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white transition" rel="noopener noreferrer" target="_blank">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.18 4.18 0 0 0 1.84-2.31 8.3 8.3 0 0 1-2.64 1.02 4.14 4.14 0 0 0-7.15 3.77A11.75 11.75 0 0 1 3.15 4.9a4.13 4.13 0 0 0 1.28 5.52 4.06 4.06 0 0 1-1.88-.52v.05a4.14 4.14 0 0 0 3.32 4.06 4.2 4.2 0 0 1-1.87.07 4.15 4.15 0 0 0 3.87 2.88A8.32 8.32 0 0 1 2 19.54 11.74 11.74 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.32 8.32 0 0 0 22.46 6Z" /></svg>
            </a>
            <a href="https://github.com" aria-label="GitHub" className="hover:text-white transition" rel="noopener noreferrer" target="_blank">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>
            </a>
          </div>
          <div className="text-xs text-white/50">© {year} thinkForward • Built for sustained velocity</div>
        </div>
      </div>
    </footer>
  );
}
