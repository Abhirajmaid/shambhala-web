import { OfferingsGrid, SectionHeader } from '@/components/sections/ContentSections';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getPublicList('products');
  const offerings = products.map((item) => ({ title: item.name, description: item.description, imageUrl: item.images?.[0], productSlug: item.slug }));
  return <main className="py-16"><SectionHeader eyebrow="Products" title="Kitchens, wardrobes, beds and storage" /><OfferingsGrid offerings={offerings} /></main>;
}
