'use client';

import { useLanguage } from '@/lib/LanguageContext';

export function Specifications() {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl">
      <p className="text-gray-500 italic text-sm sm:text-base leading-relaxed">
        {t('Detailed specifications are coming soon.')}
      </p>
    </div>
  );
}
