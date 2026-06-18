'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function splitRows(images) {
  return [images.filter((_, index) => index % 2 === 0), images.filter((_, index) => index % 2 === 1)];
}

function MarqueeRow({ images, direction = 'left', onSelect }) {
  const controls = useAnimationControls();
  const doubled = [...images, ...images];
  const target = direction === 'left' ? '-50%' : '0%';
  const initial = direction === 'left' ? '0%' : '-50%';

  return (
    <motion.div className="overflow-hidden" onHoverStart={() => controls.stop()} onHoverEnd={() => controls.start({ x: target, transition: { duration: 28, ease: 'linear', repeat: Infinity } })}>
      <motion.div className="flex w-max gap-4" initial={{ x: initial }} animate={controls} whileInView={{ x: target }} viewport={{ amount: 0.2 }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }} drag="x" dragConstraints={{ left: -900, right: 900 }}>
        {doubled.map((image, index) => <button type="button" key={(image.publicId || image.url) + index} onClick={() => onSelect(image)} className="relative h-[280px] w-[420px] shrink-0 overflow-hidden rounded-2xl bg-muted"><Image src={image.url} alt={image.caption || 'Gallery image'} fill sizes="420px" className="object-cover" loading="lazy" /></button>)}
      </motion.div>
    </motion.div>
  );
}

export function GallerySection({ folder }) {
  const [selected, setSelected] = useState(null);
  const images = useMemo(() => [...(folder.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0)), [folder.images]);
  const [rowOne, rowTwo] = splitRows(images);

  if (!images.length) return null;

  return (
    <section className="py-12">
      <div className="container-page mb-6"><h2 className="text-3xl font-semibold">{folder.name}</h2></div>
      <div className="space-y-4">
        {images.length < 6 ? <div className="container-page flex gap-4 overflow-x-auto">{images.map((image) => <button type="button" key={image.publicId || image.url} onClick={() => setSelected(image)} className="relative h-[280px] w-[420px] shrink-0 overflow-hidden rounded-2xl bg-muted"><Image src={image.url} alt={image.caption || folder.name} fill className="object-cover" /></button>)}</div> : <><MarqueeRow images={rowOne} direction="right" onSelect={setSelected} /><MarqueeRow images={rowTwo} direction="left" onSelect={setSelected} /></>}
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <AnimatePresence>{selected && <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-5xl"><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative h-[80vh] overflow-hidden rounded-2xl bg-black"><Image src={selected.url} alt={selected.caption || folder.name} fill className="object-contain" /></motion.div></DialogContent>}</AnimatePresence>
      </Dialog>
    </section>
  );
}
