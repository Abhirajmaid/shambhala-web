export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shambhalahome.com';
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }], sitemap: baseUrl + '/sitemap.xml' };
}
