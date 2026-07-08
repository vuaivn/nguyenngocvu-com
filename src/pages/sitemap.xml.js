import { getCollection } from 'astro:content';
import { site, categories } from '../config';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const staticPaths = ['', 'blog', 'gioi-thieu', 'lien-he'];
  const catPaths = categories.map((c) => `blog/category/${c.slug}`);
  const postPaths = posts.map((p) => `blog/${p.slug}`);
  const all = [...staticPaths, ...catPaths, ...postPaths];

  const urls = all
    .map(
      (path) =>
        `  <url><loc>${site.url}/${path ? path + '/' : ''}</loc></url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
