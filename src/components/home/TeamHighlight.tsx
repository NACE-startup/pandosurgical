'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { teamPeople } from '@/lib/team-data';
import { useLanguage } from '@/lib/LanguageContext';
import { translateTeamPhotoAlt } from '@/lib/i18n';

export function TeamHighlight() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const featured = teamPeople.find((person) => person.name === 'Toshi Nagai')!;
  const translatedRole = t(featured.role);

  return (
    <section className="py-12 sm:py-20 bg-mist" ref={ref}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-[3fr_2fr] gap-8 sm:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1 text-left md:pl-10 lg:pl-16"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-navy font-light leading-relaxed italic mb-6">
              "
              {t(
                "We are a group of passionate undergrads who are hungry to make a change in the surgical space. We're giving it our all to make this happen. We'd like to think we are carbon atoms undergoing pressure to become diamonds."
              )}
              "
            </p>
            <p className="text-navy font-bold">{featured.name}</p>
            <p className="text-gray-500 text-sm">{translatedRole}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative isolate z-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-md bg-white">
              <div className="absolute inset-0 rounded-full border-3 border-teal/20 z-10 pointer-events-none" />
              <img
                src={featured.image}
                alt={translateTeamPhotoAlt(language, featured.name, translatedRole)}
                className="w-full h-full object-cover relative"
                style={{ objectPosition: 'center 20%' }}
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
