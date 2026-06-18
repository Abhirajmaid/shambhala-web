'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BrochureGateForm } from '@/components/forms/BrochureGateForm';

export function HeroSection({ content }) {
  return (
    <section className="overflow-hidden bg-[var(--brand-cream)]">
      <div className="container-page grid min-h-[72vh] items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a5a32]">Custom home interiors</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">{content?.heroHeadline || 'Beautiful modular kitchens and furniture, made for Indian homes.'}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{content?.heroSubtext || 'Design-led kitchens, wardrobes, beds and storage systems from Shambhala showrooms across Maharashtra and Gujarat.'}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger render={<Button size="lg">Download Brochure</Button>} />
              <DialogContent><DialogHeader><DialogTitle>Get the brochure</DialogTitle></DialogHeader><BrochureGateForm brochureUrl={content?.brochureUrl} /></DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" render={<Link href="/projects" />}>View Projects</Button>
          </div>
        </motion.div>
        <motion.div className="relative h-[460px] overflow-hidden rounded-[2rem] bg-muted shadow-2xl" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <Image src={content?.heroImageUrl || 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80'} alt="Shambhala modular kitchen" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
        </motion.div>
      </div>
    </section>
  );
}
