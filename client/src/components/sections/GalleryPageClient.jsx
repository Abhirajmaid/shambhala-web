'use client';

import { useCallback, useState } from 'react';
import { GallerySection } from './GallerySection';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export function GalleryPageClient({ initialFolders = [], initialCursor = null, initialHasMore = true }) {
  const [folders, setFolders] = useState(initialFolders);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const params = new URLSearchParams({ limit: '4' });
    if (cursor !== null && cursor !== undefined) params.set('cursor', cursor);
    const response = await fetch('/api/gallery?' + params.toString());
    const data = await response.json();
    setFolders((current) => [...current, ...(data.folders || [])]);
    setCursor(data.cursor);
    setHasMore(Boolean(data.hasMore));
    setLoading(false);
  }, [cursor, hasMore, loading]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return <div>{folders.map((folder) => <GallerySection key={folder.id} folder={folder} />)}{loading && <div className="container-page grid gap-4 py-8"><Skeleton className="h-8 w-72" /><Skeleton className="h-72 w-full" /></div>}<div ref={sentinelRef} className="h-8" /></div>;
}
