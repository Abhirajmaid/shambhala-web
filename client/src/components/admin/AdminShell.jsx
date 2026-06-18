'use client';

import { usePathname } from 'next/navigation';
import { ProtectedRoute } from './ProtectedRoute';
import { Sidebar } from './Sidebar';

export function AdminShell({ children }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return children;
  return <ProtectedRoute><div className="flex min-h-screen bg-muted/30"><Sidebar /><main className="flex-1 p-8">{children}</main></div></ProtectedRoute>;
}
