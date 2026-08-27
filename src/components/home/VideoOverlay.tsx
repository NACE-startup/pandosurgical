'use client';

import Link from 'next/link';
import { useIsPortrait } from '@/lib/useIsPortrait';
import { useLanguage } from '@/lib/LanguageContext';

export function VideoOverlay() {
  const isPortrait = useIsPortrait();
  const { t } = useLanguage();
  const videoSrc = isPortrait ? '/intro-mobile.mp4' : '/intro.mp4';

  return (
    <section className="bg-mist pt-24 sm:pt-28 pb-4 sm:pb-6">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="relative isolate z-20 h-[60vh] sm:h-[65vh] min-h-[400px] max-h-[640px] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black">
          <video
            key={videoSrc}
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
            src={videoSrc}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

          <div className="relative z-10 h-full px-6 sm:px-10 md:px-14 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-xl">{t('We are Pando Surgical')}</h2>
            <p className="text-gray-200 text-base sm:text-lg mb-8 max-w-lg md:max-w-none md:whitespace-nowrap">
              {t('Est. 2025 | Making surgical tools equitable, efficient, and ergonomic.')}
            </p>
            <Link
              href="/company"
              className="inline-block w-fit px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-gray-100 text-navy rounded-sm font-medium transition-colors text-sm sm:text-base"
            >
              {t('Learn more')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
