import { motion } from 'motion/react';
import holdingImage from '@/assets/laprotator-holding.png';
import holdingImageV2 from '@/assets/laprotator-holding-v2.png';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#E8ECF1]">
      {/* Centered content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 flex items-center justify-center min-h-screen pt-16 sm:pt-20 pb-32 sm:pb-16">
        <div className="text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block text-[#2A8C8F] text-xs sm:text-sm md:text-base font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Pando Surgical
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-[#0C2340] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            One-Handed Laparoscope Rotation Attachment
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Making laparoscopic surgery more equitable and efficient
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <motion.button
              onClick={() => document.getElementById('our-product')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#2A8C8F] hover:bg-[#1E7275] text-white rounded-sm font-medium shadow-lg shadow-[#2A8C8F]/20 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore the Device
            </motion.button>

            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-3.5 border border-[#0C2340]/20 text-[#0C2340] hover:bg-[#0C2340]/5 rounded-sm font-medium transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Left image — hidden on small mobile, visible from sm up */}
      <motion.div
        className="absolute bottom-0 left-0 w-[30%] sm:w-[25%] max-w-xs pointer-events-none hidden sm:block"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      >
        <img
          src={holdingImage}
          alt="Surgeon holding the LapRotator device"
          className="w-full h-auto"
          draggable={false}
        />
      </motion.div>

      {/* Right image — smaller on mobile, full on desktop */}
      <motion.div
        className="absolute bottom-0 right-0 w-[40%] sm:w-[35%] max-w-md pointer-events-none"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      >
        <img
          src={holdingImageV2}
          alt="Surgeon holding the LapRotator — alternate view"
          className="w-full h-auto"
          draggable={false}
        />
      </motion.div>
    </section>
  );
}
