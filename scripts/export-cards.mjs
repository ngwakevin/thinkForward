#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const brandDir = path.join(root, 'brand');
const outDir = path.join(brandDir, 'exports');

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function exportOne(file) {
  const svgPath = path.join(brandDir, file);
  const name = path.basename(file, '.svg');
  const svg = await fs.readFile(svgPath);
  const pngPath = path.join(outDir, `${name}.png`);
  await sharp(svg, { density: 300 }) // 300 DPI for print proof
    .png({ quality: 95 })
    .toFile(pngPath);
  console.log(`✓ Exported ${pngPath}`);
}

(async () => {
  const files = [
    'business-card-front.svg',
    'business-card-back.svg',
    'business-card-concept.svg',
    'business-card-minimal.svg',
    'business-card-minimal-dark.svg'
  ];
  await ensureDir(outDir);
  for (const f of files) {
    try { await exportOne(f); } catch (e) { console.error('Failed', f, e); }
  }
})();
