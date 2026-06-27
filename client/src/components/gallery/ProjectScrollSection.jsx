'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';

const FALLBACK_ASPECT_RATIO = 16 / 9;

function GalleryImage({ src, alt, fit = 'cover' }) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  if (src.startsWith('blob:')) {
    return <img src={src} alt={alt} className={`h-full w-full ${fitClass}`} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 28rem, 78vw"
      className={fitClass}
    />
  );
}

function MarqueeImageCard({ src, alt, onOpen }) {
  const [aspectRatio, setAspectRatio] = useState(FALLBACK_ASPECT_RATIO);

  function updateAspectRatio(width, height) {
    if (!width || !height) return;
    setAspectRatio(width / height);
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ width: `calc(var(--gallery-card-height) * ${aspectRatio})` }}
      className="group relative h-[var(--gallery-card-height)] shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm transition duration-500 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a32]/70 md:rounded-2xl"
    >
      {src.startsWith('blob:') ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          onLoad={(event) => updateAspectRatio(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 40rem, 90vw"
          className="object-contain"
          onLoadingComplete={(image) => updateAspectRatio(image.naturalWidth, image.naturalHeight)}
        />
      )}
    </button>
  );
}

function MarqueeRow({ project, reverse = false, offset = 0, onOpenImage }) {
  const projectImages = Array.isArray(project.images) ? project.images : [];
  const images = [...projectImages, ...projectImages];

  return (
    <div className="gallery-marquee-row overflow-x-auto overflow-y-visible py-1">
      <div className={`gallery-marquee-track ${reverse ? 'gallery-marquee-reverse' : ''}`}>
        {images.map((src, index) => {
          const alt = `${project.name} interior ${((index + offset) % projectImages.length) + 1}`;
          return (
            <MarqueeImageCard
              key={`${project.id}-${reverse ? 'reverse' : 'forward'}-${index}`}
              src={src}
              alt={alt}
              onOpen={() => onOpenImage(src, alt)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProjectTitle({ name }) {
  return (
    <div>
      <span className="inline-flex rounded-full border border-[#8a5a32]/25 bg-[#8a5a32]/10 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8a5a32]">
        Project
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--brand-ink)] md:text-4xl">
        {name}
      </h2>
    </div>
  );
}

export function ProjectScrollSection({ project, index = 0 }) {
  const isReversed = index % 2 === 1;
  const imageCount = Array.isArray(project.images) ? project.images.length : 0;
  const carouselRows = project.carouselRows === 1 ? 1 : 2;
  const [selectedImage, setSelectedImage] = useState(null);

  function openImage(src, alt) {
    setSelectedImage({ src, alt });
  }

  return (
    <section className="bg-[#fffaf3] py-6 md:py-9">
      <div className="container-page mb-3 grid gap-3 md:mb-5 md:grid-cols-2 md:items-end">
        <div className={isReversed ? 'md:order-2 md:text-right' : ''}>
          <ProjectTitle name={project.name} />
        </div>
        <p className={`max-w-xl text-sm leading-6 text-muted-foreground md:text-base ${isReversed ? 'md:order-1' : 'md:ml-auto md:text-right'}`}>
          {project.tagline}
        </p>
      </div>
      {imageCount > 0 ? (
        <div className="gallery-marquee-group space-y-2 [--gallery-card-height:14rem] md:space-y-3 md:[--gallery-card-height:18rem]">
          <MarqueeRow project={project} onOpenImage={openImage} />
          {carouselRows === 2 && (
            <MarqueeRow project={project} reverse offset={Math.ceil(imageCount / 2)} onOpenImage={openImage} />
          )}
        </div>
      ) : (
        <div className="container-page">
          <div className="rounded-3xl border border-dashed border-[#8a5a32]/25 bg-white/70 px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-medium text-[var(--brand-ink)]">No images uploaded in this project.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              This published project is visible with its current details. Upload images from the CMS to start the moving gallery.
            </p>
          </div>
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedImage(null)}>
          <button
            type="button"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
          >
            <X className="size-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-900" onClick={(event) => event.stopPropagation()}>
            <GalleryImage src={selectedImage.src} alt={selectedImage.alt} fit="contain" />
          </div>
        </div>
      )}
    </section>
  );
}
