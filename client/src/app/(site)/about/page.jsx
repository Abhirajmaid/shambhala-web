import { SectionHeader } from '@/components/sections/ContentSections';
import { getSingleton } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function AboutPage() {
  const page = await getSingleton('pages', 'about');
  return <main className="container-page py-16"><SectionHeader eyebrow="About" title={page?.title || 'A modular home brand built for scale'} description={page?.description || 'Shambhala brings design consultation, manufacturing capability and showroom-led service together.'} /><div className="grid gap-5 md:grid-cols-3">{['300+ kitchens', 'Multi-showroom presence', 'Factory-finished quality'].map((stat) => <div key={stat} className="rounded-2xl bg-white p-8 text-2xl font-semibold shadow-sm">{stat}</div>)}</div></main>;
}
