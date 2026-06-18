'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { loading, user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/admin/login');
  }, [isAdmin, loading, router, user]);

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Checking admin access...</div>;
  if (!user || !isAdmin) return null;
  return children;
}
