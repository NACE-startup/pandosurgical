import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import productImage from '@/assets/66ea698fd6801088f2e00c323f698a687b89cc53.png';

export function Product() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const features = [
    'Compatible with existing laparoscopic systems',
    'One-handed rotation for enhanced control',
    'Compact and lightweight frame',
    'Intuitive operation requires minimal training',
    'Reduces surgeon fatigue during procedures',
  ];

  return (
    <section id="laprotator" className="py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-amber-50/20 relative overflow-hidden" ref={ref}>
      {/* Background glass elements */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#D4A24A]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">Our Product</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] mx-auto rounded-full shadow-lg shadow-[#D4A24A]/30" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 md:order-1"
          >
            {/* Glass-morphic product card */}
            <div className="relative group">
              <motion.div
                className="relative bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/60 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Golden gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A24A]/0 via-[#D4A24A]/5 to-[#D4A24A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Golden border glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A24A]/30 via-amber-300/20 to-[#D4A24A]/30 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                <img
                  src={productImage}
                  alt="LapRotator laparoscope rotation device technical diagram showing one-handed surgical instrument attachment"
                  className="w-full relative z-10"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 md:order-2"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 bg-gradient-to-r from-[#1E293B] to-[#334155] bg-clip-text text-transparent">LapRotator</h3>
            <p className="text-xl sm:text-2xl text-[#D4A24A] mb-4 sm:mb-6">One-Handed Laparoscope Rotation</p>
            
            <div className="relative">
              {/* Glass-morphic description box */}
              <div className="bg-white/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/60 shadow-lg">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  The LapRotator is an innovative attachment for laparoscopes that enables
                  surgeons to rotate the scope with one hand, providing enhanced control and
                  flexibility during procedures. This simple yet powerful device seamlessly
                  integrates with your existing laparoscopic systems.
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#D4A24A] to-[#B8883D] rounded-full flex items-center justify-center shadow-lg shadow-[#D4A24A]/30 group-hover:shadow-xl group-hover:shadow-[#D4A24A]/50 transition-all duration-300 mt-0.5">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#D4A24A] blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
