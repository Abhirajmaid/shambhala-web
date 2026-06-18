import Image from 'next/image';
import Link from 'next/link';
import { MotionReveal } from './MotionReveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function SectionHeader({ eyebrow, title, description }) {
  return <MotionReveal className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a5a32]">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h2>{description && <p className="mt-4 text-muted-foreground">{description}</p>}</MotionReveal>;
}

export function OfferingsGrid({ offerings = [] }) {
  const fallback = ['Kitchen', 'Wardrobe', 'Bed', 'Storage'].map((title) => ({ title, description: 'CMS-editable category block.', productSlug: title.toLowerCase(), imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80' }));
  const items = offerings.length ? offerings : fallback;
  return <section className="container-page py-16"><SectionHeader eyebrow="Products" title="Designed around how you live" /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{items.map((item, index) => <MotionReveal key={item.title} delay={index * 0.05}><Link href={'/products/' + item.productSlug}><Card className="group overflow-hidden"><div className="relative h-56"><Image src={item.imageUrl} alt={item.title} fill className="object-cover transition group-hover:scale-105" /></div><CardContent className="p-5"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{item.description}</p></CardContent></Card></Link></MotionReveal>)}</div></section>;
}

export function ProcessSteps({ steps = [] }) {
  const items = steps.length ? steps : [1,2,3,4].map((step) => ({ step, title: ['Consult', 'Design', 'Manufacture', 'Install'][step - 1], description: 'CMS-editable process copy.' }));
  return <section className="bg-white py-16"><div className="container-page"><SectionHeader eyebrow="Process" title="From first call to final install" /><div className="grid gap-4 md:grid-cols-4">{items.map((item) => <Card key={item.step}><CardContent className="p-6"><Badge>{String(item.step).padStart(2, '0')}</Badge><h3 className="mt-5 text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{item.description}</p></CardContent></Card>)}</div></div></section>;
}

export function TestimonialCarousel({ testimonials = [] }) {
  const items = testimonials.length ? testimonials : [{ customerName: 'Shambhala Customer', location: 'Pune', quote: 'A smooth design and installation experience.', imageUrl: '' }];
  return <section className="container-page py-16"><SectionHeader eyebrow="Customers" title="Homes with stories" /><div className="grid gap-5 md:grid-cols-3">{items.slice(0,3).map((item) => <Card key={item.id || item.customerName}><CardContent className="p-6"><p className="text-lg">�{item.quote}�</p><p className="mt-5 font-semibold">{item.customerName}</p><p className="text-sm text-muted-foreground">{item.location}</p></CardContent></Card>)}</div></section>;
}

export function TrustedByLogos({ partners = [] }) {
  return <section className="container-page py-12"><div className="rounded-3xl bg-white p-8 shadow-sm"><p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Trusted brand partners</p><div className="mt-6 grid grid-cols-2 items-center gap-6 md:grid-cols-5">{(partners.length ? partners : ['Merino','Hettich','Blum','Hafele','Ebco'].map((name) => ({ name }))).map((partner) => <div key={partner.id || partner.name} className="text-center text-lg font-semibold text-muted-foreground">{partner.logoUrl ? <Image src={partner.logoUrl} alt={partner.name} width={160} height={64} className="mx-auto max-h-12 w-auto object-contain" /> : partner.name}</div>)}</div></div></section>;
}

export function ShowroomLocator({ showrooms = [] }) {
  const items = showrooms.length ? showrooms : [{ city: 'Pune', address: 'Add showroom address from CMS.', mapLink: '/contact', phone: '' }];
  return <section className="container-page py-16"><SectionHeader eyebrow="Showrooms" title="Visit a Shambhala showroom" /><div className="grid gap-5 md:grid-cols-3">{items.map((showroom) => <Card key={showroom.id || showroom.city}><CardContent className="p-6"><h3 className="text-xl font-semibold">{showroom.city}</h3><p className="mt-2 text-sm text-muted-foreground">{showroom.address}</p><Button className="mt-5" variant="outline" render={<a href={showroom.mapLink || '#'} />}>Get Direction</Button></CardContent></Card>)}</div></section>;
}

export function BlogCard({ post }) {
  return <Link href={'/blog/' + post.slug}><Card className="overflow-hidden"><div className="relative h-52 bg-muted">{post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />}</div><CardContent className="p-5"><p className="text-sm text-muted-foreground">{post.author}</p><h3 className="mt-2 text-xl font-semibold">{post.title}</h3><p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p></CardContent></Card></Link>;
}

export function ProjectCard({ project }) {
  return <Link href={'/projects/' + project.slug}><Card className="overflow-hidden"><div className="relative h-64 bg-muted">{project.images?.[0] && <Image src={project.images[0]} alt={project.clientName} fill className="object-cover" />}</div><CardContent className="p-5"><Badge>{project.category}</Badge><h3 className="mt-3 text-xl font-semibold">{project.propertyType || project.clientName}</h3><p className="mt-2 text-sm text-muted-foreground">{project.location}</p></CardContent></Card></Link>;
}
