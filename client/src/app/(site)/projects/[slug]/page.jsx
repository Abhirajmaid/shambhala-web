import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServerDocBySlug } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function ProjectDetailPage({ params }) {
  const project = await getServerDocBySlug('projects', params.slug);
  if (!project) notFound();
  return <main className="container-page py-16"><p className="text-sm uppercase tracking-[0.2em] text-[#8a5a32]">{project.location}</p><h1 className="mt-3 text-5xl font-bold">{project.propertyType || project.clientName}</h1><blockquote className="mt-6 max-w-3xl text-2xl">�{project.testimonialQuote}�</blockquote><div className="mt-10 grid gap-4 md:grid-cols-2">{(project.images || []).map((image) => <div key={image} className="relative h-80 overflow-hidden rounded-2xl"><Image src={image} alt={project.clientName} fill className="object-cover" /></div>)}</div></main>;
}
