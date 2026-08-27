'use client';

import { useState, useEffect } from 'react';

/** Always starts `false` on both server and client to avoid a hydration mismatch, then syncs to the real value after mount. */
export function useIsPortrait() {
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(orientation: portrait)');
    setPortrait(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return portrait;
}
