'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProjectStateProvider } from './ProjectStateProvider';
import { Sidebar } from './Sidebar';

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (loading) return;
    if (!isLogin && !user) {
      router.replace('/admin/login');
    } else if (isLogin && user) {
      router.replace('/admin/dashboard');
    }
  }, [isLogin, loading, router, user]);

  if (pathname === '/admin/login') return children;
  if (loading || !user) {
    return <div className="min-h-screen bg-[#f4f5f2] p-8 text-sm text-muted-foreground">Checking admin access...</div>;
  }

  return (
    <ProjectStateProvider>
      <div className="flex min-h-screen bg-[#f4f5f2] text-slate-950">
        <Sidebar />
        <main className="min-w-0 flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </ProjectStateProvider>
  );
}
