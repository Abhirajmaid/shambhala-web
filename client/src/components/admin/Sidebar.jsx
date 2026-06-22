'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: signOut } = useAuth();
  const activePath = pathname.startsWith('/admin/projects') ? '/admin/dashboard' : pathname;

  async function logout() {
    await signOut();
    router.replace('/admin/login');
  }

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col bg-[#100c09] p-5 text-white">
      <nav className="flex-1 space-y-2 overflow-y-auto pt-8">
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/65 transition hover:border-[#d98445]/50 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70',
              activePath === link.href && 'border-[#d98445]/70 bg-[#d98445]/15 text-white'
            )}
          >
            <span className="grid size-8 place-items-center rounded-xl bg-white/10 text-white">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                <path d="M3.5 4.5A1.5 1.5 0 0 1 5 3h3.5v5.5h-5V4.5ZM11.5 3H15a1.5 1.5 0 0 1 1.5 1.5v3h-5V3ZM3.5 11.5h5V17H5a1.5 1.5 0 0 1-1.5-1.5v-4ZM11.5 11.5h5v4A1.5 1.5 0 0 1 15 17h-3.5v-5.5Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#d98445]">Signed in</p>
        <p className="mt-2 truncate text-sm text-white/70">{user?.email || 'Firebase admin'}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:border-[#d98445]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
