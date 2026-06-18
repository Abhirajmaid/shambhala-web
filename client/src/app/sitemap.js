import { getPublicList } from '@/lib/firebase/server-data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shambhalahome.com';
  const [products, projects, posts] = await Promise.all([getPublicList('products'), getPublicList('projects'), getPublicList('blogPosts')]);
  return [
    '', 'about', 'products', 'projects', 'gallery', 'blog', 'careers', 'life-at-shambhala', 'franchise', 'contact', 'privacy-policy',
    ...products.map((item) => 'products/' + item.slug),
    ...projects.map((item) => 'projects/' + item.slug),
    ...posts.map((item) => 'blog/' + item.slug),
  ].map((path) => ({ url: baseUrl + '/' + path, lastModified: new Date() }));
}
