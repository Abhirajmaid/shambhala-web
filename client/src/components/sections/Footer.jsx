import Image from 'next/image';
import Link from 'next/link';

const footerColumns = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/projects', label: 'Projects' },
      { href: '/products', label: 'Products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
      { href: '/franchise', label: 'Franchise' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function Footer({ settings, showrooms = [] }) {
  const socialLinks = [
    { href: settings?.socials?.instagram, label: 'Instagram', shortLabel: 'Ig' },
    { href: settings?.socials?.facebook, label: 'Facebook', shortLabel: 'Fb' },
    { href: settings?.socials?.linkedin, label: 'LinkedIn', shortLabel: 'In' },
  ].filter((link) => link.href);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#100c09] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d98445]/60 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-8 size-64 rounded-full bg-[#8a5a32]/10 blur-3xl" />

      <div className="container-page relative grid gap-10 py-12 sm:grid-cols-2 md:py-14 lg:grid-cols-[1.45fr_0.8fr_0.8fr_0.8fr_1.15fr] lg:gap-12">
        <div className="max-w-sm sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
            aria-label={settings?.siteName || 'Shambhala Home'}
          >
            <Image
              src="/Shambhala-Logo-2024.png"
              alt={settings?.siteName || 'Shambhala Home'}
              width={300}
              height={120}
              className="h-auto w-44 object-contain md:w-52"
            />
          </Link>
          <p className="mt-5 text-sm leading-6 text-white/65">CMS-driven modular kitchens, wardrobes, beds and furniture across Maharashtra and Gujarat.</p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ href, label, shortLabel }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-8 place-items-center rounded-full border border-white/10 text-[10px] font-semibold uppercase tracking-wide text-white/65 transition hover:border-[#d98445]/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortLabel}
                </a>
              ))}
            </div>
          )}
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-white">{column.title}</p>
            <div className="mt-4 grid gap-3 text-sm text-white/60">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit rounded-sm transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <div className="mt-4 space-y-2 text-sm leading-6 text-white/60">
            <p>{settings?.phone || '+91 00000 00000'}</p>
            <p>{settings?.email || 'hello@shambhalahome.com'}</p>
            <p className="pt-2 leading-7">{showrooms[0]?.address || 'Visit one of our showrooms for a design consultation.'}</p>
          </div>
        </div>
      </div>

      <div className="container-page relative border-t border-white/10 py-5">
        <div className="flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings?.siteName || 'Shambhala Home'}</p>
          <div className="flex gap-4">
            {footerColumns[2].links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
