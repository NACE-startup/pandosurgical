'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import withoutImage from '@/assets/without-laprotator.gif';
import withImage from '@/assets/with-laprotator.gif';
import { useLanguage } from '@/lib/LanguageContext';

export function Comparison() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const animationConfig = isMobile || prefersReducedMotion
    ? { duration: 0.3 }
    : { duration: 0.6 };

  return (
    <div ref={ref}>
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-navy/10">
        <motion.div
          className="pb-8 sm:pb-0 sm:pr-8 lg:pr-12"
          initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={animationConfig}
        >
          <div className="relative isolate z-20 aspect-video">
            <img
              src={withoutImage.src}
              alt={t('Traditional laparoscopic surgery technique without LapRotator')}
              className="w-full h-full object-contain"
              loading={isMobile ? 'lazy' : 'eager'}
              decoding="async"
            />
          </div>
          <h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl text-gray-600 text-center">{t('Without LapRotator')}</h3>
        </motion.div>

        <motion.div
          className="pt-8 sm:pt-0 sm:pl-8 lg:pl-12"
          initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ ...animationConfig, delay: 0.1 }}
        >
          <div className="relative isolate z-20 aspect-video">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
              <div className="bg-navy text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-xs sm:text-sm font-medium shadow-lg">
                 LapRotator
              </div>
            </div>
            <img
              src={withImage.src}
              alt={t('Laparoscopic surgery with LapRotator V2')}
              className="w-full h-full object-contain"
              loading={isMobile ? 'lazy' : 'eager'}
              decoding="async"
            />
          </div>
          <h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl text-teal font-semibold text-center">{t('With LapRotator V2')}</h3>
        </motion.div>
      </div>
    </div>
  );
}
