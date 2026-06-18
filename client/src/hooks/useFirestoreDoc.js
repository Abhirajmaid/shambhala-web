'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';

export function useFirestoreDoc(collectionName, id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return undefined;
    return onSnapshot(doc(db, collectionName, id), (snapshot) => {
      setItem(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });
  }, [collectionName, id]);

  return { item, loading };
}
