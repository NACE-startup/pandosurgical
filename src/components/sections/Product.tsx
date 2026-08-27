'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import productRender from '@/assets/laprotator-v23.png';
import productPhoto from '@/assets/laprotator-product-2.png';
import { Comparison } from './Comparison';
import { FeaturesAndAdvantages } from './FeaturesAndAdvantages';
import { useLanguage } from '@/lib/LanguageContext';

const productImages = [
  { src: productRender.src, alt: 'LapRotator V2 laparoscope rotation device render' },
  { src: productPhoto.src, alt: 'The LapRotator device mounted on a laparoscope' },
];

const tabs = [
  { id: 'difference', label: 'See the Difference', heading: 'LapRotator - See the Difference' },
  { id: 'features', label: 'Features and Advantages', heading: 'Features and Advantages' },
] as const;

const stats = [
  { stat: 'One-Handed', label: 'Laparoscope Rotation' },
  { stat: 'Universal', label: 'System Compatibility' },
  { stat: 'Ergonomic', label: 'Less Surgeon Fatigue' },
  { stat: 'Quick Setup', label: 'Easy Attachment' },
];

export function Product() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('difference');
  const activeTabInfo = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="our-product" className="pb-16 sm:pb-24 bg-mist" ref={ref}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative isolate z-20 bg-white rounded-sm aspect-[4/3] flex items-center justify-center p-8 sm:p-12 overflow-hidden">
              <img
                key={activeImage}
                src={productImages[activeImage].src}
                alt={t(productImages[activeImage].alt)}
                className="max-w-full max-h-full object-contain [filter:drop-shadow(0_0_2px_white)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_2px_white)]"
              />
            </div>

            <div className="flex items-center justify-between mt-4 sm:mt-6">
              <div className="flex gap-2 sm:gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`${t('View product image')}${language === 'zh' ? '' : ' '}${index + 1}`}
                    className={`relative isolate z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-sm overflow-hidden bg-white border-2 transition-colors ${
                      activeImage === index ? 'border-teal' : 'border-transparent hover:border-navy/20'
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImage((i) => (i - 1 + productImages.length) % productImages.length)}
                  aria-label={t('Previous product image')}
                  className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-mist transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage((i) => (i + 1) % productImages.length)}
                  aria-label={t('Next product image')}
                  className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-mist transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4 text-navy font-bold">
              LapRotator
            </h3>
            <p className="text-lg sm:text-xl text-teal font-medium mb-4 sm:mb-6">{t('One-Handed Laparoscope Rotation')}</p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              {t(
                'The LapRotator is an attachment on the laparoscope that gives surgeons full one-handed control over scope rotation during minimally invasive procedures.'
              )}
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              {t(
                'By removing the need for a second hand or assistant to reposition the scope, it helps surgeons reduce fatigue during long procedures, mitigate safety hazards, and work more efficiently in the OR.'
              )}
            </p>

            <Link
              href="/contact"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-teal hover:bg-teal-hover text-white rounded-sm font-medium transition-colors text-sm sm:text-base"
            >
              {t('Contact Us')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-navy/10 mb-10 sm:mb-14"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {stats.map((item) => (
            <div key={item.label} className="text-center py-5 sm:py-2 px-2 sm:px-6 flex flex-col items-center justify-center min-w-0">
              <p className="text-base sm:text-xl md:text-2xl font-bold text-navy mb-1">{t(item.stat)}</p>
              <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">{t(item.label)}</p>
            </div>
          ))}
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
          {activeTab === 'difference' ? <Comparison /> : <FeaturesAndAdvantages />}
        </div>
      </div>
    </section>
  );
}
