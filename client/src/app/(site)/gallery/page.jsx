import { GalleryPageClient } from '@/components/sections/GalleryPageClient';
import { SectionHeader } from '@/components/sections/ContentSections';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function GalleryPage() {
  const folders = await getPublicList('galleryFolders', { limit: 4 });
  return <main className="py-16"><SectionHeader eyebrow="Gallery" title="A continuously moving gallery of real homes" description="Folders are managed from the CMS and loaded in batches." /><GalleryPageClient initialFolders={folders} initialCursor={folders.at(-1)?.order ?? null} initialHasMore={folders.length === 4} /></main>;
}
