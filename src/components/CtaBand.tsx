'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface CtaBandProps {
  title: string;
  actions: { label: string; href: string; variant?: 'primary' | 'secondary' }[];
}

export function CtaBand({ title, actions }: CtaBandProps) {
  const { t } = useLanguage();

  return (
    <section className="relative isolate z-20 bg-navy py-14 sm:py-20">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 max-w-2xl">{t(title)}</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.variant === 'secondary'
                  ? 'px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 text-white hover:bg-white/10 rounded-sm font-medium transition-colors text-sm sm:text-base'
                  : 'px-6 sm:px-8 py-3 sm:py-3.5 bg-teal hover:bg-teal-hover text-white rounded-sm font-medium shadow-lg shadow-teal/25 transition-colors text-sm sm:text-base'
              }
            >
              {t(action.label)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
