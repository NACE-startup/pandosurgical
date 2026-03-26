import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="mission" className="py-12 sm:py-20 bg-[#E8ECF1] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="bg-white rounded-sm shadow-md border-l-4 border-[#2A8C8F] p-6 sm:p-10">
          <motion.div
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[#0C2340] font-bold">Our Mission</h2>
            <div className="w-20 sm:w-24 h-1 bg-[#2A8C8F] mx-auto rounded-full" />
          </motion.div>

          {/* Dark navy callout box - matching pitch deck style */}
          <motion.div
            className="bg-[#0C2340] rounded-sm p-6 sm:p-10 max-w-3xl mx-auto mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 leading-relaxed font-light text-center">
              To make laparoscopic surgery more{' '}
              <span className="text-[#2A8C8F] font-medium">equitable</span> and{' '}
              <span className="text-[#2A8C8F] font-medium">efficient</span>{' '}
              by developing intuitive surgical tools that empower surgeons worldwide.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { stat: 'One-Handed', label: 'Intuitive Rotation' },
              { stat: 'Universal', label: 'System Compatibility' },
              { stat: 'Ergonomic', label: 'Less Surgeon Fatigue' },
              { stat: 'Quick Setup', label: 'Easy Attachment' },
            ].map((item) => (
              <div key={item.label} className="text-center bg-[#E8ECF1] rounded-sm p-3 sm:p-6 flex flex-col items-center justify-center min-w-0">
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-[#0C2340] mb-1">{item.stat}</p>
                <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
