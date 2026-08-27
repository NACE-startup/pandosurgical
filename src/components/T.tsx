'use client';

import { useLanguage } from '@/lib/LanguageContext';

/** Drop-in translator for literal text inside Server Component pages, which can't call hooks directly. */
export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}
