import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="home" className="min-h-screen pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-amber-50/30 -z-10" />
      
      {/* Animated glass-morphic background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#D4A24A]/20 to-amber-300/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-[#D4A24A]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-[#D4A24A]/15 to-transparent rounded-full blur-2xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center">
          <motion.h1
            className="text-6xl md:text-7xl mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#D4A24A] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Simple Laparoscope Rotation
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Intuitive motion and control
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => document.getElementById('laprotator')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative px-8 py-4 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl shadow-xl overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Learn More</span>
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}