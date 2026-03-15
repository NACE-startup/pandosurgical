import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import withoutImage from '@/assets/without-laprotator.gif';
import withImage from '@/assets/with-laprotator.gif';

export function Comparison() {
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
    <section id="surgeons" className="py-12 sm:py-20 bg-gradient-to-b from-blue-50/20 via-white to-slate-50 relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#2563EB]/8 to-transparent rounded-full blur-xl sm:blur-3xl" style={{ transform: 'translateZ(0)' }} />
      <div className="absolute bottom-1/4 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-xl sm:blur-3xl" style={{ transform: 'translateZ(0)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={animationConfig}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#0A192F] to-[#1B3A5C] bg-clip-text text-transparent">See the Difference</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] mx-auto rounded-full shadow-lg shadow-[#2563EB]/30" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...animationConfig, delay: 0.1 }}
          >
            <div className="bg-white/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-200/50 sm:hover:-translate-y-2 transition-transform duration-300">
              <div className="aspect-video bg-white p-4 sm:p-8 border-b border-gray-200/30">
                <img
                  src={withoutImage}
                  alt="Traditional laparoscopic surgery technique without LapRotator - demonstrating two-handed scope manipulation"
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="p-4 sm:p-8 text-center bg-white/50">
                <h3 className="text-lg sm:text-2xl text-gray-600">Without LapRotator</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...animationConfig, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-[#2563EB]/8 to-blue-100/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#2563EB]/30 sm:hover:-translate-y-2 transition-transform duration-300">
              <div className="hidden sm:block absolute -inset-1 bg-gradient-to-r from-[#2563EB]/30 via-blue-300/20 to-[#2563EB]/30 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
                   LapRotator
                </div>
              </div>

              <div className="aspect-video bg-white p-4 sm:p-8 border-b border-[#2563EB]/20">
                <img
                  src={withImage}
                  alt="Laparoscopic surgery with LapRotator V1 - showing improved one-handed scope rotation and control"
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="p-4 sm:p-8 text-center bg-white/60">
                <h3 className="text-lg sm:text-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent font-semibold">With LapRotator V1</h3>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 sm:mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...animationConfig, delay: 0.3 }}
        >
          
        </motion.div>
      </div>
    </section>
  );
}
