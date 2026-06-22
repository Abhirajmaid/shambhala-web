import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const highlightImages = [
  {
    src: '/image.png',
    alt: 'Shambhala home exterior and living inspiration',
    className: '',
  },
  {
    src: '/kitchen.jpeg',
    alt: 'Shambhala modular kitchen display',
    className: '',
  },
  {
    src: '/war.jpg',
    alt: 'Shambhala wardrobe interior with seating nook',
    className: 'md:col-span-2',
  },
];

export function GalleryHighlight() {
  return (
    <section className="bg-[var(--brand-ink)] py-16 text-white md:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d7a56f]">
            Crafted Details
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            A quieter look at the textures, storage, and finishes that make a home feel complete.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
            Visit a showroom to pair the inspiration you see here with materials, hardware, and layouts made for your space.
          </p>
          <Button
            className="mt-7 bg-white text-[var(--brand-ink)] hover:bg-white/85 focus-visible:ring-white/70"
            render={<Link href="/contact" />}
          >
            Visit a showroom
          </Button>
        </div>
        <div className="grid auto-rows-[13rem] gap-4 sm:grid-cols-2 md:auto-rows-[15rem]">
          {highlightImages.map((image) => (
            <div
              key={image.src}
              className={`relative overflow-hidden rounded-3xl bg-white/10 shadow-2xl ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
