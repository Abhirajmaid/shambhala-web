import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function GalleryHero() {
  return (
    <section className="relative min-h-[40svh] overflow-hidden bg-[var(--brand-cream)] md:min-h-[58vh]">
      <Image
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"
        alt="Warm modern Shambhala home interior"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="container-page relative z-10 flex min-h-[40svh] items-end justify-center pb-8 text-center md:min-h-[58vh] md:pb-16">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a5a32]">
            Gallery
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-[var(--brand-ink)] md:mt-4 md:text-6xl lg:text-7xl">
            A continuously moving gallery of real homes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:mt-5 md:text-lg">
            Step through kitchens, wardrobes, bedrooms, and living details shaped for everyday Indian homes.
          </p>
          <Button
            size="lg"
            className="mt-6 focus-visible:ring-white/80 md:mt-7"
            render={<Link href="#gallery-projects" />}
          >
            Explore Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
