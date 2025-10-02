// Post-build tasks (CommonJS)
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const readingTime = require('reading-time');

// Replace require('../config/site') with inline config to avoid TS import issues
const siteConfig = {
  name: 'Cloudegree',
  description: 'Structured cloud & DevOps momentum: tracks, mentorship, events, and practical guides.',
  // Use explicit production domain fallback so locally missing env still emits correct absolute URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudegree.com'
};

// Inline replacement for ../lib/posts (TS not directly loadable here)
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
function readAllPostFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const walk = dir => fs.readdirSync(dir).flatMap(f => {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) return walk(full);
    return f.endsWith('.mdx') ? [full] : [];
  });
  return walk(BLOG_DIR);
}
function getAllPostsMeta() {
  return readAllPostFiles().map(full => {
    const raw = fs.readFileSync(full, 'utf-8');
    const { data, content } = matter(raw);
    const slug = full.replace(BLOG_DIR + path.sep, '').replace(/\\/g,'/').replace(/\.mdx$/, '');
    const stats = readingTime(content);
    return {
      title: data.title || slug,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      updated: data.updated,
      slug,
      readingTime: `${Math.max(1, Math.round(stats.minutes))} min read`
    };
  }).sort((a,b)=> (a.date > b.date ? -1 : 1));
}

const site = siteConfig.url.replace(/\/$/, '');

console.log('Post-build tasks');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function buildRSS() {
  const posts = getAllPostsMeta();
  const items = posts.map(p => `\n    <item>\n      <title><![CDATA[${p.title}]]></title>\n      <link>${site}/blog/${p.slug}</link>\n      <guid>${site}/blog/${p.slug}</guid>\n      <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n      <description><![CDATA[${p.description || ''}]]></description>\n    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${siteConfig.name} Blog</title>\n    <link>${site}</link>\n    <description>${siteConfig.description}</description>${items}\n  </channel>\n</rss>`;
  ensureDir(path.join(process.cwd(), 'public'));
  fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), xml);
  console.log('Generated RSS feed with', posts.length, 'posts');
}

function buildSitemap() {
  const posts = getAllPostsMeta();
  const staticUrls = ['/', '/blog', '/products', '/solutions', '/events', '/docs'];
  const urls = [
    ...staticUrls.map(u => ({ loc: `${site}${u}`, lastmod: new Date().toISOString() })),
    ...posts.map(p => ({ loc: `${site}/blog/${p.slug}`, lastmod: p.updated || p.date }))
  ];
  const body = urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  ensureDir(path.join(process.cwd(), 'public'));
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
  console.log('Generated sitemap with', urls.length, 'urls');
}

function buildRobots() {
  const content = `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;
  ensureDir(path.join(process.cwd(), 'public'));
  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), content);
  console.log('Generated robots.txt');
}

try {
  buildRSS();
  buildSitemap();
  buildRobots();
} catch (err) {
  console.error('Post-build script failed:', err);
  process.exit(1);
}
