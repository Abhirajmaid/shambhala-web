import { GalleryHero } from '@/components/gallery/GalleryHero';
import { GalleryHighlight } from '@/components/gallery/GalleryHighlight';
import { GalleryProjects } from '@/components/gallery/GalleryProjects';

export default function GalleryPage() {
  return (
    <main className="overflow-hidden">
      <GalleryHero />
      <div id="gallery-projects">
        <GalleryProjects />
      </div>
      <GalleryHighlight />
    </main>
  );
}
