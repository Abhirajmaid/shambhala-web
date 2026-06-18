import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { getServerDocBySlug } from '@/lib/firebase/server-data';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const product = await getServerDocBySlug('products', params.slug);
  return { title: product?.name || 'Product', description: product?.description };
}

export default async function ProductDetailPage({ params }) {
  const product = await getServerDocBySlug('products', params.slug);
  if (!product) notFound();
  return <main className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_0.7fr]"><div><h1 className="text-5xl font-bold">{product.name}</h1><p className="mt-4 text-muted-foreground">{product.description}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{(product.images || []).map((image) => <div key={image} className="relative h-72 overflow-hidden rounded-2xl"><Image src={image} alt={product.name} fill className="object-cover" /></div>)}</div><ul className="mt-8 grid gap-2">{(product.features || []).map((feature) => <li key={feature} className="rounded-lg bg-white p-3">{feature}</li>)}</ul></div><aside className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-2xl font-semibold">Request callback</h2><CallbackForm source={'product:' + product.slug} requirement={product.category} /></aside></main>;
}
