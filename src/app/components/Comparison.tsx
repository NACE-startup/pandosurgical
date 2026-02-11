import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import withoutImage from '@/assets/4032ba0b38a12acf65ad2f27674d4b81431314e0.png';
import withImage from '@/assets/4fec24e54aaf45e3afd92a2ce7745cf5eca2e82c.png';

export function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-amber-50/20 via-white to-slate-50 relative overflow-hidden" ref={ref}>
      {/* Background glass effects */}
      <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#D4A24A]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">See the Difference</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] mx-auto rounded-full shadow-lg shadow-[#D4A24A]/30" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Glass-morphic card */}
            <motion.div 
              className="bg-white/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-200/50"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-video bg-white p-4 sm:p-8 border-b border-gray-200/30">
                <img
                  src={withoutImage}
                  alt="Traditional laparoscopic surgery technique without LapRotator - demonstrating two-handed scope manipulation"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-8 text-center bg-white/50">
                <h3 className="text-lg sm:text-2xl text-gray-600">Without LapRotator</h3>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Premium glass-morphic card with golden accents */}
            <motion.div 
              className="relative bg-gradient-to-br from-[#D4A24A]/10 to-amber-100/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A24A]/40"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Golden glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A24A]/40 via-amber-300/30 to-[#D4A24A]/40 rounded-2xl sm:rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              {/* Recommended badge with glass effect */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                <div className="relative">
                  <div className="bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg shadow-[#D4A24A]/50">
                    Recommended
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#D4A24A] blur-md opacity-50 -z-10" />
                </div>
              </div>
              
              <div className="aspect-video bg-white p-4 sm:p-8 border-b border-[#D4A24A]/20">
                <img
                  src={withImage}
                  alt="Laparoscopic surgery with LapRotator V1 - showing improved one-handed scope rotation and control"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-8 text-center bg-white/60">
                <h3 className="text-lg sm:text-2xl bg-gradient-to-r from-[#D4A24A] to-[#B8883D] bg-clip-text text-transparent font-semibold">With LapRotator V1</h3>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 sm:mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Glass-morphic text container */}
          <div className="bg-white/70 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/60 shadow-lg">
            <p className="text-base sm:text-xl text-gray-700">
              Experience the difference with one-handed control. The LapRotator V1 provides
              superior ergonomics and precision, reducing strain and improving surgical outcomes.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
