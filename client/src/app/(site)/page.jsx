import Link from 'next/link';
import { BlogCard, OfferingsGrid, ProcessSteps, ShowroomLocator, TestimonialCarousel, TrustedByLogos } from '@/components/sections/ContentSections';
import { HeroSection } from '@/components/sections/HeroSection';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { Button } from '@/components/ui/button';
import { getPublicList, getSingleton } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function HomePage() {
  const [home, testimonials, team, partners, posts, showrooms] = await Promise.all([
    getSingleton('home'), getPublicList('testimonials', { limit: 6 }), getPublicList('team', { limit: 4 }), getPublicList('brandPartners', { limit: 8 }), getPublicList('blogPosts', { limit: 3 }), getPublicList('showrooms'),
  ]);
  return <main><HeroSection content={home} /><OfferingsGrid offerings={home?.offerings} /><section className="container-page grid gap-8 py-16 lg:grid-cols-2"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a5a32]">Design consultation</p><h2 className="mt-3 text-4xl font-bold">Request a callback</h2><p className="mt-3 text-muted-foreground">Tell us what you want to build and our showroom team will call you.</p></div><CallbackForm source="home" /></section><TestimonialCarousel testimonials={testimonials} /><section className="container-page py-16"><h2 className="text-4xl font-bold">Why Shambhala</h2><div className="mt-6 grid gap-4 md:grid-cols-5">{(home?.whyShambhalaPoints || []).map((point) => <div key={point.title} className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-semibold">{point.title}</h3><p className="mt-2 text-sm text-muted-foreground">{point.description}</p></div>)}</div></section><section className="container-page py-16"><h2 className="text-4xl font-bold">Mentors and Leadership</h2><div className="mt-6 grid gap-4 md:grid-cols-4">{team.map((member) => <div key={member.id} className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-semibold">{member.name}</h3><p className="text-sm text-muted-foreground">{member.role}</p></div>)}</div></section><section className="container-page py-16"><div className="rounded-3xl bg-[#8a5a32] p-10 text-white"><h2 className="text-4xl font-bold">Partner with Shambhala</h2><p className="mt-3 text-white/75">Explore franchise opportunities with a proven modular home brand.</p><Button className="mt-6" render={<Link href="/franchise" />}>Franchise Inquiry</Button></div></section><TrustedByLogos partners={partners} /><ProcessSteps steps={home?.processSteps} /><section className="container-page py-16"><h2 className="text-4xl font-bold">Latest from the blog</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></section><ShowroomLocator showrooms={showrooms} /></main>;
}
