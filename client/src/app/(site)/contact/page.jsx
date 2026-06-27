import { LeadForm } from '@/components/forms/LeadForm';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function ContactPage() {
  const showrooms = await getPublicList('showrooms');
  const jsonLd = showrooms.map((showroom) => ({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Shambhala Home ' + showroom.city, address: showroom.address, telephone: showroom.phone }));
  const highlights = ['Free consultation', '24 hour callback', 'Material guidance'];

  return (
    <main className="relative overflow-hidden bg-[#fff7ed]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-[#8a5a32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-[#d98445]/15 blur-3xl" />
      <section className="container-page relative py-10 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-[2.25rem] border border-[#8a5a32]/10 bg-white shadow-[0_24px_80px_rgba(31,26,23,0.12)]">
            <div className="relative overflow-hidden bg-[var(--brand-ink)] px-5 py-8 text-center text-white sm:px-8 md:px-12 md:py-10">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d98445] to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d7a56f]">Contact</p>
              <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Book a design consultation
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                Share a few details about your home. Our team will call back with practical design, material, and showroom guidance.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {highlights.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#fffbf6] p-5 sm:p-7 md:p-10">
              <LeadForm type="contact" source="contact-page" cta="Send Message" className="mx-auto max-w-3xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
