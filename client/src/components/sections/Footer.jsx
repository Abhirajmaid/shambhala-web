import Link from 'next/link';
import { siteNavLinks } from '@/constants/nav-links';

export function Footer({ settings, showrooms = [] }) {
  return (
    <footer className="border-t bg-[#1f1a17] text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold">{settings?.siteName || 'Shambhala Home'}</p>
          <p className="mt-3 max-w-sm text-sm text-white/70">CMS-driven modular kitchens, wardrobes, beds and furniture across Maharashtra and Gujarat.</p>
        </div>
        <div>
          <p className="font-medium">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            {siteNavLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-medium">Contact</p>
          <p className="mt-3 text-sm text-white/70">{settings?.phone || '+91 00000 00000'}</p>
          <p className="text-sm text-white/70">{settings?.email || 'hello@shambhalahome.com'}</p>
          <p className="mt-4 text-sm text-white/70">{showrooms[0]?.address || 'Visit one of our showrooms for a design consultation.'}</p>
        </div>
      </div>
    </footer>
  );
}
