import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="home" className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden bg-[#E8ECF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="text-center max-w-3xl">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-tight text-[#0C2340] font-bold px-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Premier Laparoscopic Rotating Device
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Making laparoscopic surgery more equitable and efficient
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => document.getElementById('our-product')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative px-8 sm:px-10 py-3.5 sm:py-4 bg-[#2A8C8F] hover:bg-[#1E7275] text-white rounded-sm shadow-lg overflow-hidden group text-sm sm:text-base font-medium transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Learn More</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
