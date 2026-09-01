'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { teamPeople, advisoryPeople, teamPhotoStyle, type Person } from '@/lib/team-data';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '@/lib/LanguageContext';
import { translateTeamPhotoAlt, translateLinkedInAria } from '@/lib/i18n';

const CELL_WIDTH_CLASS = 'w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]';

export function Team() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const TeamCell = ({ member, index, baseDelay = 0 }: { member: Person; index: number; baseDelay?: number }) => {
    const translatedRole = t(member.role);
    const cellBody = (
      <div className="border border-navy/10 h-full flex flex-col">
        <div className="relative isolate z-20 aspect-[4/5] overflow-hidden bg-mist">
          {member.image ? (
            <img
              src={member.image}
              alt={translateTeamPhotoAlt(language, member.name, translatedRole)}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              style={teamPhotoStyle(member.name)}
            />
          ) : (
            <ImageWithFallback src={(member as any).imageUrl!} alt={member.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-4 sm:p-6 flex-1">
          <h3 className="text-lg sm:text-xl mb-1 text-navy font-bold">{member.name}</h3>
          <span className="block text-teal text-xs font-semibold tracking-widest uppercase mb-2 sm:mb-3">
            {translatedRole}
          </span>
          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{t(member.description)}</p>
        </div>
      </div>
    );

    const motionProps = {
      className: `group ${member.linkedin ? 'cursor-pointer' : ''} ${CELL_WIDTH_CLASS}`,
      initial: { opacity: 0, y: 16 },
      animate: isInView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.5, delay: baseDelay + index * 0.08 },
    };

    if (member.linkedin) {
      return (
        <motion.a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translateLinkedInAria(language, member.name)}
          {...motionProps}
        >
          {cellBody}
        </motion.a>
      );
    }

    return <motion.div {...motionProps}>{cellBody}</motion.div>;
  };

  return (
    <section className="py-16 sm:py-24 bg-white" ref={ref}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {teamPeople.map((member, index) => (
            <TeamCell key={member.name} member={member} index={index} baseDelay={0.15} />
          ))}
        </div>

        <motion.div
          className="text-left mt-14 sm:mt-20 mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 text-navy font-bold">{t('Advisory Board')}</h3>
        </motion.div>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          {advisoryPeople.map((member, index) => (
            <TeamCell key={member.name} member={member} index={index} baseDelay={0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
