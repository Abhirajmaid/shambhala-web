import Image from 'next/image';
import Link from 'next/link';
import { siteNavLinks } from '@/constants/nav-links';
import { Button } from '@/components/ui/button';

export function Navbar({ settings }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a32]/60" aria-label={settings?.siteName || 'Shambhala'}>
          <Image src="/logoo-removebg.png" alt={settings?.siteName || 'Shambhala'} width={884} height={244} className="h-11 w-auto object-contain" priority />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {siteNavLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-foreground">{link.label}</Link>)}
        </nav>
        <Button render={<Link href="/contact" />}>Request Callback</Button>
      </div>
    </header>
  );
}
