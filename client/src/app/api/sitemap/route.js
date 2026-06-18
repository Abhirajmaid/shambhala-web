import { NextResponse } from 'next/server';
import { getPublicList } from '@/lib/firebase/server-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shambhalahome.com';
  const [products, projects, posts] = await Promise.all([
    getPublicList('products'),
    getPublicList('projects'),
    getPublicList('blogPosts'),
  ]);
  const urls = ['/', '/about', '/products', '/projects', '/gallery', '/blog', '/careers', '/life-at-shambhala', '/franchise', '/contact', '/privacy-policy', ...products.map((item) => '/products/' + item.slug), ...projects.map((item) => '/projects/' + item.slug), ...posts.map((item) => '/blog/' + item.slug)];
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map((url) => '<url><loc>' + baseUrl + url + '</loc></url>').join('') + '</urlset>';
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
