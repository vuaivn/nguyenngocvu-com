import { getCollection } from 'astro:content';
import { site, categories } from '../config';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const today = new Date().toISOString().split('T')[0];

  const entries = [];
  // trang tĩnh
  for (const path of ['', 'blog', 'gioi-thieu', 'lien-he']) {
    entries.push({ loc: `${site.url}/${path ? path + '/' : ''}`, lastmod: today, priority: path === '' ? '1.0' : '0.7' });
  }
  // category
  for (const c of categories) {
    entries.push({ loc: `${site.url}/blog/category/${c.slug}/`, lastmod: today, priority: '0.6' });
  }
  // bài viết
  for (const p of posts) {
    const d = p.data.updatedDate ?? p.data.pubDate;
    entries.push({
      loc: `${site.url}/blog/${p.slug}/`,
      lastmod: new Date(d).toISOString().split('T')[0],
      priority: '0.8',
    });
  }

  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
