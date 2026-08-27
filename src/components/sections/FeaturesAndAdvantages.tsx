'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const features = [
  'Compatible with existing laparoscopic systems',
  'One-handed rotation for enhanced control',
  'Compact and lightweight frame',
  'Simple user interface',
  'Designed to help reduce surgeon fatigue during procedures',
];

export function FeaturesAndAdvantages() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 sm:gap-y-6 max-w-4xl" ref={ref}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.06 }}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
          </div>
          <span className="text-sm sm:text-base text-gray-700">{t(feature)}</span>
        </motion.div>
      ))}
    </div>
  );
}
