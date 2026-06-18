import { BlogCard, SectionHeader } from '@/components/sections/ContentSections';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublicList('blogPosts');
  return <main className="container-page py-16"><SectionHeader eyebrow="Blog" title="Ideas for better homes" /><div className="grid gap-5 md:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></main>;
}
