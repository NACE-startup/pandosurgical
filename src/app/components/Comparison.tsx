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
    <section id="surgeons" className="py-12 sm:py-20 bg-[#E8ECF1] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="bg-white rounded-sm shadow-md border-l-4 border-[#2A8C8F] p-6 sm:p-10">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={animationConfig}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[#0C2340] font-bold">LapRotator - See the Difference</h2>
            <div className="w-20 sm:w-24 h-1 bg-[#2A8C8F] mx-auto rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...animationConfig, delay: 0.1 }}
            >
              <div className="bg-[#E8ECF1] rounded-sm overflow-hidden sm:hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-video bg-white p-4 sm:p-8">
                  <img
                    src={withoutImage}
                    alt="Traditional laparoscopic surgery technique without LapRotator"
                    className="w-full h-full object-contain"
                    loading={isMobile ? 'lazy' : 'eager'}
                    decoding="async"
                  />
                </div>
                <div className="p-4 sm:p-6 text-center">
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
              <div className="relative bg-[#E8ECF1] rounded-sm overflow-hidden border-2 border-[#2A8C8F]/30 sm:hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                  <div className="bg-[#0C2340] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-xs sm:text-sm font-medium shadow-lg">
                     LapRotator
                  </div>
                </div>

                <div className="aspect-video bg-white p-4 sm:p-8">
                  <img
                    src={withImage}
                    alt="Laparoscopic surgery with LapRotator V2"
                    className="w-full h-full object-contain"
                    loading={isMobile ? 'lazy' : 'eager'}
                    decoding="async"
                  />
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-lg sm:text-2xl text-[#2A8C8F] font-semibold">With LapRotator V2</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
