'use client';

import { useLanguage } from '@/lib/LanguageContext';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function PageHeader({ eyebrow, title, subtitle, align = 'left' }: PageHeaderProps) {
  const { t } = useLanguage();
  const centered = align === 'center';

  return (
    <div className="pt-28 sm:pt-36 pb-6 sm:pb-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : 'text-left'}`}>
          {eyebrow && (
            <span className="inline-block text-teal text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              {t(eyebrow)}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">{t(title)}</h1>
          <div className={`w-20 sm:w-24 h-1 bg-teal rounded-full ${centered ? 'mx-auto' : ''}`} />
          {subtitle && <p className="text-gray-600 text-base sm:text-lg mt-5">{t(subtitle)}</p>}
        </div>
      </div>
    </div>
  );
}
