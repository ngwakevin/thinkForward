import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsMeta } from '../lib/posts';
import { siteConfig } from '../config/site';

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

buildRSS();
buildSitemap();
buildRobots();
