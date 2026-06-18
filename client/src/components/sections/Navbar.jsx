import Link from 'next/link';
import { siteNavLinks } from '@/constants/nav-links';
import { Button } from '@/components/ui/button';

export function Navbar({ settings }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight">{settings?.siteName || 'Shambhala'}</Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {siteNavLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-foreground">{link.label}</Link>)}
        </nav>
        <Button render={<Link href="/contact" />}>Request Callback</Button>
      </div>
    </header>
  );
}
