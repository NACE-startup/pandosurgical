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

  const teamMembers = [
    {
      name: 'Aiden Pan',
      role: 'CEO',
      image: aidenImage,
      linkedin: 'https://www.linkedin.com/in/aidenpan/',
      description:
        'Aiden is a biomedical engineering student at USC with a passion for entrepreneurship and medical devices. His drive to innovate in the surgical technology space led to the creation of the LapRotator, combining his technical knowledge with an entrepreneurial vision to solve real challenges in laparoscopic surgery.',
    },
    {
      name: 'Noah Pearson',
      role: 'CTO',
      image: noahImage,
      linkedin: 'https://www.linkedin.com/in/noah-r-pearson/',
      description:
        'Noah holds a PhD in mechanical engineering and serves as a biomechanics professor. With deep experience in laparoscopic systems from his tenure as COO of Bloom Surgical, Noah brings invaluable expertise in surgical device development and biomechanical design to Pando Surgical.',
    },
    {
      name: 'Toshi Nagai',
      role: 'COO',
      image: toshiImage,
      linkedin: 'https://www.linkedin.com/in/toshio-nagai2029/',
      description:
        'Toshi is a biomedical engineering student at USC with an interest in diagnostic device development and biomedical research. He aims to launch a biotech startup focused on designing and manufacturing affordable medical devices to reduce healthcare disparities and improve access to care universally.',
    },
    {
      name: 'Derek Hua',
      role: 'Head of Clinical Affairs',
      image: derekImage,
      linkedin: 'https://www.linkedin.com/in/derekhuausc/',
      description:
        'Derek is a biomedical engineering student at USC.',
    },
    {
      name: 'Sean Lee',
      role: 'Head of Engineering',
      image: seanImage,
      linkedin: 'https://www.linkedin.com/in/sean-long-siang-lee-9bbab8373/',
      description:
        'Sean is a biomedical engineering student at USC. His passion for biomaterials and nanotechnology confirmed his career path in a biotech/pharmaceutical startup. He aims to improve healthcare safety, efficiency, and accessibility. In his free time, Sean enjoys fencing, cooking, and playing his violin.',
    },
  ];

  return (
    <section id="our-team" className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/20 via-slate-50 to-white relative overflow-hidden" ref={ref}>
      {/* Background glass effects */}
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-[#D4A24A]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">Our Team</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] mx-auto rounded-full shadow-lg shadow-[#D4A24A]/30" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {teamMembers.map((member, index) => (
            <motion.a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${member.name}'s LinkedIn profile`}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
            >
              {/* Glass-morphic team card */}
              <motion.div 
                className="bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-white/60 hover:shadow-2xl transition-all h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Golden glow on hover */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#D4A24A]/20 via-amber-300/10 to-[#D4A24A]/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 shadow-lg bg-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Golden ring around avatar */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#D4A24A] via-amber-300 to-[#D4A24A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" style={{ zIndex: -1 }} />
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
                        src={member.imageUrl!}
                        alt={member.name}
                        className="w-full h-full object-cover relative"
                      />
                    )}
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl mb-1 sm:mb-2 bg-gradient-to-r from-[#1E293B] to-[#334155] bg-clip-text text-transparent">{member.name}</h3>
                  <div className="relative mb-3 sm:mb-4">
                    <p className="text-sm sm:text-lg text-[#D4A24A] px-3 sm:px-4 py-1 rounded-full bg-[#D4A24A]/10 border border-[#D4A24A]/20">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{member.description}</p>
                </div>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
