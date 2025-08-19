#!/usr/bin/env ts-node
import fs from 'node:fs';
import path from 'node:path';

const title = process.argv.slice(2).join(' ') || 'New Post';
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const date = new Date().toISOString();

const content = `---\ntitle: "${title}"\ndate: ${date}\ndescription: ""\ntags: []\nfeatured: false\nupdated: ${date}\ndraft: true\n---\n\nWrite your content here.\n`;

const file = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
if (fs.existsSync(file)) {
  console.error('File exists:', file);
  process.exit(1);
}
fs.writeFileSync(file, content);
console.log('Created:', file);
