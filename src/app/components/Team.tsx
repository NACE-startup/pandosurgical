import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import aidenImage from '@/assets/027189a00b21afa9a3c06baca936f81ca39a3e89.png';
import noahImage from '@/assets/8ee06f89fcb2cc02961b34226e63e63a73f4a3f6.png';
import seanImage from '@/assets/3fd5dc0d150c84d1b711b9d02daf057b44f80a37.png';
import derekImage from '@/assets/aa0c3a7a09c6d51040532cd537dd0918948e3d44.png';
import toshiImage from '@/assets/27bc2f71d3258489976d02225ee535b830fc269d.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const founders = [
    {
      name: 'Aiden Pan',
      role: 'CEO & Co-Founder',
      image: aidenImage,
      linkedin: 'https://www.linkedin.com/in/aidenpan/',
      description:
        'USC Biomedical Engineering',
    },
    {
      name: 'Noah Pearson',
      role: 'CTO & Co-Founder',
      image: noahImage,
      linkedin: 'https://www.linkedin.com/in/noah-r-pearson/',
      description:
        'PhD Mechanical Engineering',
    },
  ];

  const teamMembers = [
    {
      name: 'Toshi Nagai',
      role: 'COO',
      image: toshiImage,
      linkedin: 'https://www.linkedin.com/in/toshio-nagai2029/',
      description:
        'USC Biomedical Engineering',
    },
    {
      name: 'Derek Hua',
      role: 'Head of Clinical Affairs',
      image: derekImage,
      linkedin: 'https://www.linkedin.com/in/derekhuausc/',
      description:
        'USC Biomedical Engineering and Pre-Medicine',
    },
    {
      name: 'Sean Lee',
      role: 'Head of Engineering',
      image: seanImage,
      linkedin: 'https://www.linkedin.com/in/sean-long-siang-lee-9bbab8373/',
      description:
        'USC Biomedical Engineering',
    },
  ];

  const TeamCard = ({ member, index, baseDelay = 0 }: { member: typeof founders[0]; index: number; baseDelay?: number }) => (
    <motion.a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${member.name}'s LinkedIn profile`}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: baseDelay + index * 0.1 }}
    >
      <motion.div
        className="bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200/40 hover:shadow-2xl transition-all h-full"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB]/15 via-blue-300/10 to-[#2563EB]/15 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <div className="flex flex-col items-center text-center">
          <motion.div
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 shadow-lg bg-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB] via-blue-400 to-[#2563EB] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" style={{ zIndex: -1 }} />
            <div className="absolute inset-0 rounded-full border-4 border-white z-10 pointer-events-none" />

            {member.image ? (
              <img
                src={member.image}
                alt={`${member.name}, ${member.role} at Pando Surgical`}
                className="w-full h-full object-cover relative"
                loading="lazy"
                style={
                  member.name === 'Derek Hua'
                    ? { transform: 'scale(2.2) translateY(10%)' }
                    : member.name === 'Sean Lee'
                    ? { transform: 'scale(1.0) translateY(-2%) translateX(+2)', objectPosition: 'center' }
                    : member.name === 'Toshi Nagai'
                    ? { transform: 'scale(1.4)' }
                    : undefined
                }
              />
            ) : (
              <ImageWithFallback
                src={(member as any).imageUrl!}
                alt={member.name}
                className="w-full h-full object-cover relative"
              />
            )}
          </motion.div>

          <h3 className="text-xl sm:text-2xl mb-1 sm:mb-2 bg-gradient-to-r from-[#0A192F] to-[#1B3A5C] bg-clip-text text-transparent">{member.name}</h3>
          <div className="relative mb-3 sm:mb-4">
            <p className="text-sm sm:text-lg text-[#2563EB] px-3 sm:px-4 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20">
              {member.role}
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{member.description}</p>
        </div>
      </motion.div>
    </motion.a>
  );

  return (
    <section id="our-team" className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/20 via-slate-50 to-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-[#2563EB]/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#0A192F] to-[#1B3A5C] bg-clip-text text-transparent">Our Team</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] mx-auto rounded-full shadow-lg shadow-[#2563EB]/30" />
        </motion.div>

        <motion.h3
          className="text-xl sm:text-2xl text-center mb-6 text-gray-600 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Co-Founders
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-10 sm:mb-14">
          {founders.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} baseDelay={0.2} />
          ))}
        </div>

        <motion.h3
          className="text-xl sm:text-2xl text-center mb-6 text-gray-600 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Team
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} baseDelay={0.5} />
          ))}
        </div>
      </div>
    </section>
  );
}
