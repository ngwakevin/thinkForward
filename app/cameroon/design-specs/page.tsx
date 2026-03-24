export const metadata = {
  title: 'Cloudegree Cameroon — Design Specifications',
  description: 'Canva-ready design specifications for the Cloudegree Cameroon Go Live campaign. Brand colors, typography, layouts, and export guidelines.',
};

export default function DesignSpecsPage() {
  const colors = [
    { name: 'Primary Background', hex: '#071621', css: '--color-bg', tw: 'bg', usage: 'Main flyer/poster background, page background' },
    { name: 'Alt Background', hex: '#0E2533', css: '--color-bg-alt', tw: 'bg-alt', usage: 'Cards, sections, panels, footer' },
    { name: 'Foreground', hex: '#F5FAFC', css: '--color-fg', tw: 'fg', usage: 'Primary text, headings on dark backgrounds' },
    { name: 'Muted Text', hex: '#B5C9D3', css: '--color-fg-muted', tw: 'fg-muted', usage: 'Secondary text, descriptions, labels' },
    { name: 'Primary Accent', hex: '#00C48C', css: '--color-accent', tw: 'accent', usage: 'CTAs, headings, highlights, gradients, buttons' },
    { name: 'Secondary Accent', hex: '#00A977', css: '--color-accent-alt', tw: 'accent-alt', usage: 'Gradient endpoints, hover states, secondary buttons' },
    { name: 'Soft Accent', hex: '#E0FFF6', css: '--color-accent-soft', tw: 'accent-soft', usage: 'Light backgrounds, subtle fills, badges' },
    { name: 'Border', hex: '#163544', css: '--color-border', tw: 'border', usage: 'Card borders, dividers, separators' },
    { name: 'Warning / Orange', hex: '#FFB347', css: '--color-warning', tw: 'warning', usage: 'Dates, urgency elements, brand arrow ›' },
    { name: 'Danger / Red', hex: '#FF5F56', css: '--color-danger', tw: 'danger', usage: '"Limited Seats" labels, error states' },
  ];

  const exportSizes = [
    { format: 'Instagram Post', width: '1080', height: '1080', unit: 'px', use: 'Social media square post' },
    { format: 'Instagram Story / WhatsApp', width: '1080', height: '1920', unit: 'px', use: 'Vertical mobile format' },
    { format: 'Facebook Event Cover', width: '1920', height: '1005', unit: 'px', use: 'Event page header' },
    { format: 'Twitter / X Header', width: '1500', height: '500', unit: 'px', use: 'Profile banner' },
    { format: 'LinkedIn Banner', width: '1584', height: '396', unit: 'px', use: 'Company page banner' },
    { format: 'A5 Flyer (Print)', width: '148', height: '210', unit: 'mm @ 300dpi', use: 'Handouts, small prints' },
    { format: 'A4 Flyer (Print)', width: '210', height: '297', unit: 'mm @ 300dpi', use: 'Standard flyer' },
    { format: 'A2 Poster (Print)', width: '420', height: '594', unit: 'mm @ 300dpi', use: 'Wall posters' },
    { format: 'A1 Poster (Print)', width: '594', height: '841', unit: 'mm @ 300dpi', use: 'Large displays' },
    { format: 'Billboard Banner', width: '2400', height: '1200', unit: 'px', use: 'Outdoor digital billboard' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-24">
      {/* ─── Header ─── */}
      <section className="space-y-6 text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Brand Guidelines</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Cloudegree Cameroon<br />Design Specifications</h1>
        <p className="text-fg-muted text-base md:text-lg leading-relaxed">Canva-ready design guidelines for the Go Live Cameroon campaign. Use these specifications to create consistent, on-brand marketing materials.</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/cameroon/flyer" className="text-accent hover:text-accent-alt transition">View Flyer &amp; Poster →</a>
          <a href="/cameroon" className="text-fg-muted hover:text-fg transition">← Cameroon Landing Page</a>
        </div>
      </section>

      {/* ─── Brand Identity ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Brand Identity</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-medium text-lg">Company Name</h3>
            <p className="text-3xl font-display font-bold">
              <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Cloud</span>
              <span className="bg-gradient-to-r from-accent-alt via-accent to-accent-alt bg-clip-text text-transparent">egree</span>
              <span className="ml-0.5 text-warning">›</span>
            </p>
            <div className="text-sm text-fg-muted space-y-2">
              <p><strong className="text-fg">Full Name:</strong> Cloudegree</p>
              <p><strong className="text-fg">Wordmark:</strong> Cloudegree› (with orange arrow)</p>
              <p><strong className="text-fg">Tagline:</strong> Train. Build. Elevate.</p>
              <p><strong className="text-fg">Campaign:</strong> Go Live in Cameroon 2026</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-medium text-lg">Logo Treatment</h3>
            <div className="text-sm text-fg-muted space-y-3">
              <p><strong className="text-fg">&quot;Cloud&quot;</strong> — Gradient from <code className="text-accent text-xs bg-bg/50 px-1 rounded">#00C48C</code> → <code className="text-accent-alt text-xs bg-bg/50 px-1 rounded">#00A977</code></p>
              <p><strong className="text-fg">&quot;egree&quot;</strong> — Gradient from <code className="text-accent-alt text-xs bg-bg/50 px-1 rounded">#00A977</code> via <code className="text-accent text-xs bg-bg/50 px-1 rounded">#00C48C</code> → <code className="text-accent-alt text-xs bg-bg/50 px-1 rounded">#00A977</code></p>
              <p><strong className="text-fg">&quot;›&quot;</strong> — Warning orange <code className="text-warning text-xs bg-bg/50 px-1 rounded">#FFB347</code></p>
              <p className="pt-2"><strong className="text-fg">Min clear space:</strong> 1× the height of the &quot;C&quot; on all sides</p>
              <p><strong className="text-fg">Backgrounds:</strong> Always place on dark background (#071621 or #0E2533)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Color Palette ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Color Palette</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
          <p className="text-sm text-fg-muted">Add these as custom brand colors in Canva (Brand Kit → Colors).</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {colors.map(color => (
            <div key={color.hex} className="flex items-center gap-4 rounded-xl border border-border/60 bg-bg-alt/30 p-4">
              <div className="h-14 w-14 rounded-lg flex-shrink-0 border border-border/40 shadow-inner" style={{ backgroundColor: color.hex }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{color.name}</p>
                  <code className="text-xs text-accent bg-bg/50 px-1.5 py-0.5 rounded">{color.hex}</code>
                </div>
                <p className="text-[11px] text-fg-muted mt-0.5">CSS: <code>{color.css}</code> · Tailwind: <code>{color.tw}</code></p>
                <p className="text-[11px] text-fg-muted">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6">
          <h3 className="font-medium mb-3">Gradient Combinations</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="h-8 rounded-md bg-gradient-to-r from-[#00C48C] to-[#00A977] mb-2" />
              <p className="text-xs text-fg-muted">Primary: #00C48C → #00A977</p>
              <p className="text-[10px] text-fg-muted">Use for: Headlines, CTAs, logo text</p>
            </div>
            <div>
              <div className="h-8 rounded-md bg-gradient-to-r from-[#00A977] via-[#00C48C] to-[#00A977] mb-2" />
              <p className="text-xs text-fg-muted">Brand: #00A977 → #00C48C → #00A977</p>
              <p className="text-[10px] text-fg-muted">Use for: Logo &quot;egree&quot; text</p>
            </div>
            <div>
              <div className="h-8 rounded-md bg-gradient-to-r from-[#00C48C] via-[#00A977] to-[#FFB347] mb-2" />
              <p className="text-xs text-fg-muted">Accent Bar: #00C48C → #00A977 → #FFB347</p>
              <p className="text-[10px] text-fg-muted">Use for: Decorative bars, dividers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Typography ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Typography</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
          <p className="text-sm text-fg-muted">Both fonts are available for free on Google Fonts and in Canva.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-display text-xl font-semibold">Display / Headlines</h3>
            <p className="font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Space Grotesk</p>
            <div className="text-sm text-fg-muted space-y-1">
              <p><strong className="text-fg">Font:</strong> Space Grotesk</p>
              <p><strong className="text-fg">Weights:</strong> Bold (700), Semibold (600)</p>
              <p><strong className="text-fg">Tracking:</strong> Tight (-0.025em)</p>
              <p><strong className="text-fg">Usage:</strong> Page titles, section headings, wordmark, hero text</p>
              <p><strong className="text-fg">Canva:</strong> Search &quot;Space Grotesk&quot; in font picker</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-sans text-xl font-semibold">Body / UI Text</h3>
            <p className="font-sans text-4xl font-bold tracking-tight">Inter</p>
            <div className="text-sm text-fg-muted space-y-1">
              <p><strong className="text-fg">Font:</strong> Inter</p>
              <p><strong className="text-fg">Weights:</strong> Regular (400), Medium (500), Semibold (600), Bold (700)</p>
              <p><strong className="text-fg">Tracking:</strong> Normal</p>
              <p><strong className="text-fg">Usage:</strong> Body text, descriptions, labels, buttons, navigation</p>
              <p><strong className="text-fg">Canva:</strong> Search &quot;Inter&quot; in font picker</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6">
          <h3 className="font-medium mb-4">Type Scale (Recommended)</h3>
          <div className="space-y-3">
            {[
              { label: 'Hero Title', size: '48-72px', font: 'Space Grotesk Bold', example: 'We Are Live in Cameroon!' },
              { label: 'Section Heading', size: '28-36px', font: 'Space Grotesk Bold', example: 'Choose Your Cloud Path' },
              { label: 'Card Title', size: '18-20px', font: 'Space Grotesk Semibold', example: 'Cloud Foundation' },
              { label: 'Body Text', size: '14-16px', font: 'Inter Regular', example: 'Pragmatic acceleration for Cloud & DevOps skills' },
              { label: 'Small / Label', size: '11-12px', font: 'Inter Semibold Uppercase', example: 'TRAINING TRACKS' },
              { label: 'Caption / Micro', size: '10px', font: 'Inter Bold Uppercase', example: 'COMING SOON — 2026' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4 text-sm">
                <div className="w-36 flex-shrink-0">
                  <p className="font-semibold text-fg">{item.label}</p>
                  <p className="text-[10px] text-fg-muted">{item.size}</p>
                </div>
                <div className="flex-1">
                  <p className="text-fg-muted">{item.font}</p>
                  <p className="text-[11px] text-fg-muted/60 italic">&quot;{item.example}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Layout Guidelines ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Layout Guidelines</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Spacing', desc: 'Use 8px base grid. Padding: 24-48px for sections, 16-24px for cards. Gap between cards: 16-24px.' },
            { title: 'Border Radius', desc: 'Large cards: 16px (2xl). Small elements: 8px (lg). Buttons: 6px (md). Badges: 9999px (full).' },
            { title: 'Borders', desc: 'Use #163544 at 60% opacity for card borders. Hover state: #00C48C at 30% opacity.' },
            { title: 'Shadows', desc: 'Minimal shadows: 0 1px 2px rgba(0,0,0,0.05) for cards. Glow: 0 0 0 3px #E0FFF6 for focus states.' },
            { title: 'Background Effects', desc: 'Gradient overlays from bg to bg-alt. Decorative glow circles using accent at 10% opacity with blur.' },
            { title: 'Content Width', desc: 'Max width: 1280px (7xl). Text content: 768px (3xl). Centered with auto margins.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-bg-alt/30 p-5">
              <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-fg-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Canva Setup Instructions ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Canva Setup Instructions</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Step-by-Step Brand Kit Setup</h3>
            <ol className="space-y-4 text-sm text-fg-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-[#071621] flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-medium text-fg">Create a Brand Kit</p>
                  <p>In Canva, go to Brand Kit → Create New. Name it &quot;Cloudegree Cameroon Campaign&quot;.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-[#071621] flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-medium text-fg">Add Brand Colors</p>
                  <p>Add all 10 hex codes from the Color Palette section above. Label them with their usage names.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-[#071621] flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-medium text-fg">Set Fonts</p>
                  <p>Heading font: &quot;Space Grotesk&quot; Bold. Body font: &quot;Inter&quot; Regular. Both are available in Canva&apos;s font library.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-[#071621] flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <p className="font-medium text-fg">Set Background</p>
                  <p>Default background: #071621. For all designs, start with this dark navy background color.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-[#071621] flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <p className="font-medium text-fg">Create Design Templates</p>
                  <p>Start with &quot;Custom size&quot; and use the Export Sizes table below for each format you need.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ─── Export Sizes ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Export Sizes</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
          <p className="text-sm text-fg-muted">Use these dimensions when creating designs in Canva or any design tool.</p>
        </div>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt/60 text-left">
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Format</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Width</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Height</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Unit</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {exportSizes.map(size => (
                <tr key={size.format} className="hover:bg-bg-alt/20 transition">
                  <td className="px-6 py-3 font-medium">{size.format}</td>
                  <td className="px-6 py-3 text-accent">{size.width}</td>
                  <td className="px-6 py-3 text-accent">{size.height}</td>
                  <td className="px-6 py-3 text-fg-muted">{size.unit}</td>
                  <td className="px-6 py-3 text-fg-muted hidden md:table-cell">{size.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Campaign Messaging ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Campaign Messaging</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-medium text-lg">Headlines</h3>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Cloudegree is LIVE in Cameroon!&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Cloud &amp; DevOps Training — Now in Cameroon&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Your Cloud Career Starts Here&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Train. Build. Elevate. — Cameroon Edition&quot;</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
            <h3 className="font-medium text-lg">Call-to-Action Copy</h3>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" /> &quot;Register Now — Limited Seats!&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" /> &quot;Scan QR to Join&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" /> &quot;Book Your Free Mentoring Session&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" /> &quot;Start Your Cloud Journey Today&quot;</li>
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 space-y-4">
          <h3 className="font-medium text-lg">Sub-headlines &amp; Descriptions</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Structured cloud &amp; DevOps momentum: tracks, mentorship, events, and practical guides.&quot;</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;From zero to cloud practitioner — with hands-on labs and real-world projects.&quot;</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Pragmatic acceleration for Cloud &amp; DevOps skills — now available in Cameroon.&quot;</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> &quot;Custom, outcomes-driven training for individuals and organizations.&quot;</li>
          </ul>
        </div>
      </section>

      {/* ─── Design Checklist ─── */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Design Checklist</h2>
          <div className="h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-4">Every Flyer Must Have</h3>
              <ul className="space-y-2 text-sm text-fg-muted">
                {[
                  'Cloudegree› wordmark (gradient + orange arrow)',
                  '"Go Live 2026" badge',
                  '🇨🇲 Cameroon reference',
                  '"Train. Build. Elevate." tagline',
                  'At least 3 offerings (Bootcamps, Mentoring, Labs)',
                  'Event details (Date, Location, Pricing)',
                  'Clear CTA button',
                  'Registration URL or QR code',
                  'Contact email',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded border border-accent/50 flex-shrink-0 flex items-center justify-center text-accent text-[10px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Every Poster Must Have</h3>
              <ul className="space-y-2 text-sm text-fg-muted">
                {[
                  'All flyer elements above',
                  'Three training track pillars (Cloud, DevOps, Security)',
                  'Full registration form fields preview',
                  'Large, readable text (minimum 24pt for headings)',
                  'Gradient accent bar (top or bottom)',
                  'Sufficient white space for readability',
                  'Footer with brand and tagline',
                  'Print-ready at 300dpi',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded border border-accent/50 flex-shrink-0 flex items-center justify-center text-accent text-[10px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer Links ─── */}
      <section className="text-center space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Ready to Create?</h2>
        <p className="text-sm text-fg-muted">Use these specs in Canva, Figma, or Adobe tools to create on-brand campaign materials.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/cameroon/flyer" className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-alt transition">View Flyer &amp; Poster</a>
          <a href="/cameroon" className="inline-flex items-center rounded-md border border-accent/40 px-6 py-3 text-sm font-medium text-accent hover:border-accent transition">Cameroon Landing Page</a>
          <a href="/contact" className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-fg hover:border-accent hover:text-accent transition">Contact Us</a>
        </div>
      </section>
    </div>
  );
}
