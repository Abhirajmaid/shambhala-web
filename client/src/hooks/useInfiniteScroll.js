'use client';

import { useEffect, useRef } from 'react';

export function useInfiniteScroll(callback, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled || !ref.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, { rootMargin: '600px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
}
