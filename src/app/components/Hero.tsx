import { motion, useReducedMotion } from 'motion/react';
import holdingImage from '@/assets/laprotator-holding.png';
import holdingImageV2 from '@/assets/laprotator-holding-v2.png';
import laparoscopeHero from '@/assets/laparoscope-hero.png';

export function Hero() {
  const reduced = useReducedMotion();
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 } };
  const sideEnterMotion = reduced
    ? fade
    : { initial: { scale: 0.97 }, animate: { scale: 1 } };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#E8ECF1] sm:h-auto sm:min-h-screen"
      aria-label="Pando Surgical hero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 min-h-[100dvh] h-full sm:h-auto sm:min-h-[100dvh] flex flex-col pt-[3.75rem] pb-8 sm:pt-20 sm:pb-16 sm:justify-center md:pb-20">
        <div className="text-center max-w-3xl w-full mx-auto shrink-0 flex flex-col flex-1 sm:flex-none sm:block justify-center sm:justify-start gap-0 sm:gap-0 min-h-0">
          <motion.div
            {...(reduced ? fade : { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="inline-block text-[#2A8C8F] text-[11px] sm:text-sm md:text-base font-semibold tracking-widest uppercase mb-4 sm:mb-4 drop-shadow-sm relative z-10">
              Pando Surgical
            </span>
          </motion.div>

          <motion.h1
            className="relative z-10 font-bold text-[#0C2340] mb-5 sm:mb-6 sm:leading-[1.1] [text-shadow:0_1px_3px_rgba(232,236,241,0.95)] sm:[text-shadow:none]"
            {...(reduced ? fade : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            {/* Mobile: laparoscope behind title only — −90° (anti-clockwise), larger, slightly more visible */}
            <div
              className="sm:hidden absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[min(130vw,28rem)] aspect-[4/3] max-h-[78vw] pointer-events-none z-0 overflow-visible"
              aria-hidden
            >
              <img
                src={laparoscopeHero}
                alt=""
                className="absolute left-1/2 top-1/2 h-[min(98vw,24rem)] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 translate-y-1 rotate-[-90deg] opacity-[0.38] object-contain object-center drop-shadow-[0_8px_28px_rgba(12,35,64,0.12)]"
                draggable={false}
              />
            </div>

            <span className="relative z-10 sm:hidden block text-[clamp(2.125rem,11.2vw,3rem)] leading-[1.22] tracking-tight space-y-3.5">
              <span className="block">One-Handed</span>
              <span className="block">Laparoscope</span>
              <span className="block">Rotation</span>
              <span className="block">Attachment</span>
            </span>
            <span className="hidden sm:inline text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              One-Handed Laparoscope Rotation Attachment
            </span>
          </motion.h1>

          <motion.p
            className="relative z-10 text-[0.95rem] leading-[1.65] sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-xl mx-auto sm:leading-normal px-1 sm:px-0 [text-shadow:0_1px_2px_rgba(232,236,241,0.9)] sm:[text-shadow:none]"
            {...(reduced ? fade : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Making laparoscopic surgery more equitable and efficient
          </motion.p>

          <motion.div
            className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-sm sm:max-w-none mx-auto sm:mx-0 mt-auto sm:mt-0 pb-2 sm:pb-0"
            {...(reduced ? fade : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.45, delay: 0.45 }}
          >
            <motion.button
              onClick={() => document.getElementById('our-product')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#2A8C8F] hover:bg-[#1E7275] text-white rounded-sm font-medium shadow-lg shadow-[#2A8C8F]/25 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              LapRotator
            </motion.button>

            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-3.5 border border-[#0C2340]/25 bg-[#E8ECF1]/92 sm:bg-transparent text-[#0C2340] hover:bg-[#0C2340]/5 rounded-sm font-medium transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Side art: left baseline. Right (v2) framed tighter — wider slot, higher max-h, scale (bottom-right origin) to match glove size vs left. */}
      <motion.div
        className="hidden sm:flex absolute bottom-0 left-0 z-[1] w-[min(32rem,max(12rem,calc(50vw-8.25rem)))] md:w-[min(36rem,max(14.5rem,calc(50vw-11.75rem)))] lg:w-[min(44rem,max(16rem,calc(50vw-24.55rem)))] xl:w-[min(50rem,max(16rem,calc(50vw-24.62rem)))] 2xl:w-[min(56rem,max(17rem,calc(50vw-24.68rem)))] items-end justify-start pointer-events-none p-0"
        {...sideEnterMotion}
        transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
      >
        <img
          src={holdingImage}
          alt="Surgeon holding the LapRotator device"
          className="w-full h-auto max-h-[min(78dvh,clamp(18rem,40vw,52rem))] object-contain object-left-bottom"
          draggable={false}
        />
      </motion.div>

      <motion.div
        className="hidden sm:flex absolute bottom-0 right-0 z-[1] w-[min(46rem,max(14.5rem,calc(50vw-6.75rem)))] md:w-[min(54rem,max(18rem,calc(50vw-9.25rem)))] lg:w-[min(64rem,max(22rem,calc(50vw-22rem)))] xl:w-[min(74rem,max(23rem,calc(50vw-23rem)))] 2xl:w-[min(84rem,max(24rem,calc(50vw-23.1rem)))] items-end justify-end pointer-events-none p-0"
        {...sideEnterMotion}
        transition={{ duration: 0.55, delay: 0.36, ease: 'easeOut' }}
      >
        <img
          src={holdingImageV2}
          alt="Surgeon holding the LapRotator — alternate view"
          className="w-full h-auto max-h-[min(94dvh,clamp(24rem,50vw,64rem))] object-contain object-right-bottom origin-bottom-right scale-[1.14] md:scale-[1.18] lg:scale-[1.22] xl:scale-[1.2] 2xl:scale-[1.18]"
          draggable={false}
        />
      </motion.div>

      {/* Soft bottom edge into next section (same page bg) — no scroll-driven fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[8] h-24 sm:h-36 bg-gradient-to-b from-transparent via-[#E8ECF1]/35 to-[#E8ECF1]"
        aria-hidden
      />
    </section>
  );
}
