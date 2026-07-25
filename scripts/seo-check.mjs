// Kiểm tra SEO cơ bản trên HTML output (dist/)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

function walk(dir) {
  let files = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (e.endsWith('.html')) files.push(p);
  }
  return files;
}

const pages = walk(DIST);
let totalScore = 0, totalMax = 0;
const rows = [];

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(DIST, '').replace(/\\/g, '/');
  const checks = {
    title: /<title>[^<]{10,70}<\/title>/.test(html),
    metaDesc: /<meta name="description" content="[^"]{50,170}"/.test(html),
    canonical: /<link rel="canonical"/.test(html),
    ogTitle: /property="og:title"/.test(html),
    ogImage: /property="og:image"/.test(html),
    twitter: /name="twitter:card"/.test(html),
    h1: (html.match(/<h1[ >]/g) || []).length === 1,
    jsonld: /application\/ld\+json/.test(html),
    imgAlt: !/<img(?![^>]*\balt=)[^>]*>/.test(html), // không có img thiếu alt
    lang: /<html lang="vi"/.test(html),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const max = Object.keys(checks).length;
  totalScore += passed; totalMax += max;
  const fails = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  rows.push({ page: rel, score: `${passed}/${max}`, fails: fails.join(', ') || '—' });
}

// sitemap + robots
const hasSitemap = existsSync(join(DIST, 'sitemap.xml'));
const hasRobots = existsSync(join(DIST, 'robots.txt'));
const hasRss = existsSync(join(DIST, 'rss.xml'));

console.log('\n=== SEO CHECK REPORT ===');
for (const r of rows) console.log(`${r.score}  ${r.page}${r.fails !== '—' ? '  ⚠ ' + r.fails : '  ✓'}`);
console.log('\n--- Site-wide ---');
console.log(`sitemap.xml: ${hasSitemap ? '✓' : '✗'}`);
console.log(`robots.txt:  ${hasRobots ? '✓' : '✗'}`);
console.log(`rss.xml:     ${hasRss ? '✓' : '✗'}`);
const pct = Math.round((totalScore / totalMax) * 100);
console.log(`\nTONG DIEM: ${totalScore}/${totalMax} (${pct}%)`);
