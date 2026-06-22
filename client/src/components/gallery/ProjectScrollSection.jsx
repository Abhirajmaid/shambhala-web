import Image from 'next/image';

function GalleryImage({ src, alt }) {
  if (src.startsWith('blob:')) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 28rem, 78vw"
      className="object-cover"
    />
  );
}

function MarqueeRow({ project, reverse = false, offset = 0 }) {
  const projectImages = Array.isArray(project.images) ? project.images : [];
  const images = [...projectImages, ...projectImages];

  return (
    <div className="gallery-marquee-row overflow-x-auto overflow-y-visible py-2">
      <div className={`gallery-marquee-track ${reverse ? 'gallery-marquee-reverse' : ''}`}>
        {images.map((src, index) => (
          <div
            key={`${project.id}-${reverse ? 'reverse' : 'forward'}-${index}`}
            aria-hidden={index >= projectImages.length}
            className="group relative h-56 w-[78vw] max-w-[28rem] shrink-0 overflow-hidden rounded-3xl bg-muted shadow-sm transition duration-500 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-2xl md:h-72 md:w-[28rem]"
          >
            <GalleryImage
              src={src}
              alt={`${project.name} interior ${((index + offset) % projectImages.length) + 1}`}
            />
          </div>
        ))}
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

  return (
    <section className="bg-[#fffaf3] py-10 md:py-14">
      <div className="container-page mb-5 grid gap-4 md:mb-7 md:grid-cols-2 md:items-end">
        <div className={isReversed ? 'md:order-2 md:text-right' : ''}>
          <ProjectTitle name={project.name} />
        </div>
        <p className={`max-w-xl text-sm leading-6 text-muted-foreground md:text-base ${isReversed ? 'md:order-1' : 'md:ml-auto md:text-right'}`}>
          {project.tagline}
        </p>
      </div>
      {imageCount > 0 ? (
        <div className="gallery-marquee-group space-y-3 md:space-y-4">
          <MarqueeRow project={project} />
          <MarqueeRow project={project} reverse offset={Math.ceil(imageCount / 2)} />
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
    </section>
  );
}
