'use client';

import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setClaims(currentUser ? (await currentUser.getIdTokenResult()).claims : null);
      setLoading(false);
    });
  }, []);

  return {
    user,
    claims,
    loading,
    isAdmin: claims?.role === 'admin' || claims?.admin === true,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
  };
}
