'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { adminNavLinks } from '@/constants/nav-links';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r bg-white/90 p-4 backdrop-blur">
      <Link href="/admin/dashboard" className="mb-6 text-xl font-semibold">Shambhala CMS</Link>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {adminNavLinks.map((link) => (
          <Link key={link.href} href={link.href} className={cn('block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground', pathname === link.href && 'bg-muted text-foreground')}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" onClick={logout} className="mt-4 justify-start"><LogOut /> Logout</Button>
    </aside>
  );
}
