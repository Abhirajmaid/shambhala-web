import { notFound } from 'next/navigation';
import { TiptapRenderer } from '@/components/sections/TiptapRenderer';
import { getServerDocBySlug } from '@/lib/firebase/server-data';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const post = await getServerDocBySlug('blogPosts', params.slug);
  return { title: post?.title || 'Blog', description: post?.excerpt };
}

export default async function BlogDetailPage({ params }) {
  const post = await getServerDocBySlug('blogPosts', params.slug);
  if (!post) notFound();
  return <main className="container-page max-w-4xl py-16"><p className="text-sm text-muted-foreground">{post.author}</p><h1 className="mt-3 text-5xl font-bold">{post.title}</h1><p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p><div className="mt-10"><TiptapRenderer content={post.contentJson} /></div></main>;
}
