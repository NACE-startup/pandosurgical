import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="mission" className="py-16 sm:py-24 bg-[#0A192F] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-white">Our Mission</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] mx-auto rounded-full shadow-lg shadow-[#2563EB]/30 mb-8 sm:mb-12" />
        </motion.div>

        <motion.blockquote
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 leading-relaxed font-light">
            To make laparoscopic surgery more{' '}
            <span className="text-[#2563EB] font-medium">equitable</span> and{' '}
            <span className="text-[#2563EB] font-medium">efficient</span>{' '}
            by developing intuitive surgical tools that empower surgeons worldwide.
          </p>
        </motion.blockquote>

        <motion.div
          className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { stat: 'One-Handed', label: 'Intuitive Rotation' },
            { stat: 'Universal', label: 'System Compatibility' },
            { stat: 'Reduced', label: 'Surgeon Fatigue' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-[#2563EB] mb-1">{item.stat}</p>
              <p className="text-gray-400 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
