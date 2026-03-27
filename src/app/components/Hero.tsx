import { motion, useReducedMotion } from 'motion/react';
import heroLeftArt from '@/assets/laprotator-hero-left.png';
import heroRightArt from '@/assets/laprotator-hero-right.png';
import laparoscopeHero from '@/assets/laparoscope-hero.png';

/** Side images: pinned to bottom corners, large, with bottom fade. Hidden on mobile, shown md+. */
const heroSideShell =
  'hidden md:block absolute bottom-0 z-[5] pointer-events-none w-[clamp(20rem,44vw,40rem)] lg:w-[clamp(24rem,46vw,44rem)] xl:w-[clamp(28rem,44vw,48rem)]';

const heroSideImg =
  'w-full h-auto object-contain drop-shadow-[0_4px_20px_rgba(12,35,64,0.08)]';

const heroSideFade =
  'pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#E8ECF1] to-transparent';

export function Hero() {
  const reduced = useReducedMotion();
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 } };
  const sideEnterMotion = reduced
    ? fade
    : { initial: { scale: 0.97 }, animate: { scale: 1 } };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] h-[100dvh] overflow-x-hidden overflow-y-hidden bg-[#E8ECF1] sm:h-auto sm:min-h-screen sm:overflow-x-clip sm:overflow-y-visible"
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

      {/* Side art: large images at bottom corners with bottom edge fade */}
      <motion.div
        className={`${heroSideShell} left-0 scale-[0.95] origin-bottom-left`}
        {...sideEnterMotion}
        transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
      >
        <img
          src={heroLeftArt}
          alt="Gloved hand holding a laparoscopic instrument"
          className={`${heroSideImg} object-left-bottom`}
          draggable={false}
        />
        <div className={heroSideFade} aria-hidden />
      </motion.div>

      <motion.div
        className={`${heroSideShell} right-0 origin-bottom-right`}
        {...sideEnterMotion}
        transition={{ duration: 0.55, delay: 0.36, ease: 'easeOut' }}
      >
        <img
          src={heroRightArt}
          alt="Gloved hand holding the LapRotator device"
          className={`${heroSideImg} object-right-bottom`}
          draggable={false}
        />
        <div className={heroSideFade} aria-hidden />
      </motion.div>

      {/* Bottom scrim into next section — below side art (was z-8 and covered z-1 images) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-24 sm:h-36 bg-gradient-to-b from-transparent via-[#E8ECF1]/35 to-[#E8ECF1]"
        aria-hidden
      />
    </section>
  );
}
