import { LeadForm } from '@/components/forms/LeadForm';
import { ShowroomLocator, SectionHeader } from '@/components/sections/ContentSections';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function ContactPage() {
  const showrooms = await getPublicList('showrooms');
  const jsonLd = showrooms.map((showroom) => ({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Shambhala Home ' + showroom.city, address: showroom.address, telephone: showroom.phone }));
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><section className="container-page grid gap-10 py-16 lg:grid-cols-2"><div><SectionHeader eyebrow="Contact" title="Book a design consultation" /><LeadForm type="contact" source="contact-page" cta="Send Message" /></div><ShowroomLocator showrooms={showrooms} /></section></main>;
}
