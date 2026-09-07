import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const SITEMAP_PATH = 'public/sitemap.xml';
const BASE_URL = 'https://autoup.lt';

const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/paslaugos', changefreq: 'monthly', priority: 0.9 },
  { url: '/akcijos', changefreq: 'weekly', priority: 0.8 },
  { url: '/kontaktai', changefreq: 'monthly', priority: 0.8 },
  { url: '/paslaugos/vaziuokles-remontas', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/padangu-montavimas', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/stabdziu-remontas', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/tepalu-keitimas', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/kompiuterine-diagnostika', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/ischeckio-remontas', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/technine-pagalba', changefreq: 'monthly', priority: 0.7 },
  { url: '/paslaugos/zibintu-stiklu-poliravimas', changefreq: 'monthly', priority: 0.7 },
];

const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url === '/' ? '' : page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  try {
    mkdirSync(dirname(SITEMAP_PATH), { recursive: true });
    writeFileSync(SITEMAP_PATH, sitemapContent.trim());
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
};

generateSitemap();