import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function GalleryHighlight() {
  return (
    <section className="bg-[var(--brand-ink)] py-14 text-white md:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d7a56f]">
            Crafted Details
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Ready to shape these ideas into your home?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
            Visit a showroom to pair inspiration with finishes, hardware, and layouts made for your space.
          </p>
          <Button
            className="mt-7 h-11 rounded-full bg-white px-6 font-semibold text-[var(--brand-ink)] hover:bg-white/85 focus-visible:ring-white/70"
            render={<Link href="/contact" />}
          >
            Visit a showroom
          </Button>
        </div>
      </div>
    </section>
  );
}
