'use client';

import { useEffect, useState } from 'react';
import { listenToAuthState, signInAdmin, signOutAdmin } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return listenToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    login: signInAdmin,
    logout: signOutAdmin,
  };
}
