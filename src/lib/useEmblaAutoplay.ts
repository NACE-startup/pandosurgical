'use client';

import { useEffect, useRef } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

type EmblaApi = UseEmblaCarouselType[1];

/** Minimal setInterval-based autoplay for embla (no autoplay plugin installed). Pauses on hover/focus, skipped entirely when `enabled` is false (e.g. prefers-reduced-motion). */
export function useEmblaAutoplay(api: EmblaApi, { delay = 6000, enabled = true }: { delay?: number; enabled?: boolean } = {}) {
  const paused = useRef(false);

  useEffect(() => {
    if (!api || !enabled) return;

    const interval = setInterval(() => {
      if (paused.current) return;
      api.scrollNext();
    }, delay);

    return () => clearInterval(interval);
  }, [api, enabled, delay]);

  return {
    onMouseEnter: () => {
      paused.current = true;
    },
    onMouseLeave: () => {
      paused.current = false;
    },
    onFocus: () => {
      paused.current = true;
    },
    onBlur: () => {
      paused.current = false;
    },
  };
}
