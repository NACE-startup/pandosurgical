import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import aidenImage from '@/assets/027189a00b21afa9a3c06baca936f81ca39a3e89.jpg';
import noahImage from '@/assets/8ee06f89fcb2cc02961b34226e63e63a73f4a3f6.jpg';
import seanImage from '@/assets/3fd5dc0d150c84d1b711b9d02daf057b44f80a37.jpg';
import derekImage from '@/assets/aa0c3a7a09c6d51040532cd537dd0918948e3d44.jpg';
import toshiImage from '@/assets/27bc2f71d3258489976d02225ee535b830fc269d.jpg';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const founders = [
    { name: 'Aiden Pan', role: 'CEO & Co-Founder', image: aidenImage, linkedin: 'https://www.linkedin.com/in/aidenpan/', description: 'USC Biomedical Engineering' },
    { name: 'Noah Pearson', role: 'CTO & Co-Founder', image: noahImage, linkedin: 'https://www.linkedin.com/in/noah-r-pearson/', description: 'PhD Mechanical Engineering' },
  ];

  const teamMembers = [
    { name: 'Toshi Nagai', role: 'Advisor', image: toshiImage, linkedin: 'https://www.linkedin.com/in/toshio-nagai2029/', description: 'USC Biomedical Engineering' },
    { name: 'Derek Hua', role: 'Head of Clinical Affairs', image: derekImage, linkedin: 'https://www.linkedin.com/in/derekhuausc/', description: 'USC Biomedical Engineering and Pre-Medicine' },
    { name: 'Sean Lee', role: 'Head of Engineering', image: seanImage, linkedin: 'https://www.linkedin.com/in/sean-long-siang-lee-9bbab8373/', description: 'USC Biomedical Engineering' },
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
        className="bg-white rounded-sm shadow-md p-4 sm:p-6 hover:shadow-lg transition-all h-full"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 shadow-md bg-white"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-full border-3 border-[#2A8C8F]/20 z-10 pointer-events-none" />
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
              <ImageWithFallback src={(member as any).imageUrl!} alt={member.name} className="w-full h-full object-cover relative" />
            )}
          </motion.div>

          <h3 className="text-xl sm:text-2xl mb-1 sm:mb-2 text-[#0C2340] font-bold">{member.name}</h3>
          <div className="relative mb-3 sm:mb-4">
            <p className="text-sm sm:text-base text-[#2A8C8F] font-medium px-3 sm:px-4 py-1 rounded-sm bg-[#2A8C8F]/10">
              {member.role}
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{member.description}</p>
        </div>
      </motion.div>
    </motion.a>
  );

  return (
    <section id="our-team" className="py-12 sm:py-16 bg-[#E8ECF1] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="bg-white rounded-sm shadow-md border-l-4 border-[#2A8C8F] p-6 sm:p-10">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[#0C2340] font-bold">Our Team</h2>
            <div className="w-20 sm:w-24 h-1 bg-[#2A8C8F] mx-auto rounded-full" />
          </motion.div>

          <motion.h3
            className="text-xl sm:text-2xl text-center mb-6 text-gray-500 font-medium"
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
            className="text-xl sm:text-2xl text-center mb-6 text-gray-500 font-medium"
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
      </div>
    </section>
  );
}
