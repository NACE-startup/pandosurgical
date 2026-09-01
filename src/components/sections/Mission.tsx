'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export function Mission() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref}>
      <motion.div
        className="relative isolate z-20 bg-charcoal"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="text-sm sm:text-base text-gray-400 text-center mb-3 sm:mb-4">{t('Our Mission')}</p>
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl md:text-3xl text-gray-200 leading-relaxed font-light text-center">
            {t('To make surgery more')}{' '}
            <span className="text-teal font-medium">{t('equitable')}</span>,{' '}
            <span className="text-teal font-medium">{t('efficient')}</span>, {t('and')}{' '}
            <span className="text-teal font-medium">{t('ergonomic')}</span>{' '}
            {t('by developing tools that empower surgeons worldwide.')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
