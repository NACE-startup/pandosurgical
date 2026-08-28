'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Comparison } from './Comparison';
import { FeaturesAndAdvantages } from './FeaturesAndAdvantages';
import { Specifications } from './Specifications';
import { useLanguage } from '@/lib/LanguageContext';

const tabs = [
  { id: 'difference', label: 'See the Difference', heading: 'LapRotator - See the Difference' },
  { id: 'features', label: 'Features and Advantages', heading: 'Features and Advantages' },
  { id: 'specifications', label: 'Specifications', heading: 'Specifications' },
] as const;

export function Product() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('difference');
  const activeTabInfo = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="our-product" className="pb-16 sm:pb-24 bg-mist" ref={ref}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-2">LapRotator</h3>
          <p className="text-lg sm:text-xl text-teal font-medium">{t('One-Handed Laparoscope Rotation')}</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative isolate z-20 bg-charcoal rounded-sm px-6 py-8 sm:p-10 md:p-14 mb-10 sm:mb-14 overflow-hidden"
        >
          <img
            src="/laprotator-hero.png"
            alt={t('The LapRotator device')}
            className="block mx-auto w-3/4 max-w-xs mb-6 sm:float-left sm:w-2/5 sm:max-w-sm sm:mr-10 sm:mb-2 sm:mx-0"
          />
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 text-center sm:text-left">
            {t(
              'The LapRotator is an attachment on the laparoscope that gives surgeons full one-handed control over scope rotation during minimally invasive procedures.'
            )}
          </p>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 text-center sm:text-left">
            {t(
              'By removing the need for a second hand or assistant to reposition the scope, it helps surgeons reduce fatigue during long procedures, mitigate safety hazards, and work more efficiently in the OR.'
            )}
          </p>
          <div className="clear-both" />
          <div className="text-center sm:text-right">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors text-sm sm:text-base"
            >
              {t('Request a Demo')}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="flex gap-8 sm:gap-10 border-b border-navy/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 -mb-px border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-teal text-navy'
                  : 'border-transparent text-gray-500 hover:text-navy hover:border-navy/20'
              }`}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>

        <div className="pt-8 sm:pt-10">
          <h2 className="text-xl sm:text-2xl mb-5 sm:mb-6 text-navy font-bold">{t(activeTabInfo.heading)}</h2>
          {activeTab === 'difference' && <Comparison />}
          {activeTab === 'features' && <FeaturesAndAdvantages />}
          {activeTab === 'specifications' && <Specifications />}
        </div>
      </div>
    </section>
  );
}
