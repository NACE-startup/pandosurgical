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
      <section className="bg-white pt-16 sm:pt-24 pb-10 sm:pb-14">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
          <motion.div
            className="text-left"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-navy font-bold">{t('Our Mission')}</h2>
            <div className="w-20 sm:w-24 h-1 bg-teal rounded-full" />
          </motion.div>
        </div>
      </section>

      <motion.div
        className="relative isolate z-20 bg-navy"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 py-14 sm:py-20">
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
