import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import productImage from '@/assets/laprotator-v23.png';

export function Product() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const features = [
    'Compatible with existing laparoscopic systems',
    'One-handed rotation for enhanced control',
    'Compact and lightweight frame',
    'Simple user interface',
    'Designed to help reduce surgeon fatigue during procedures',
  ];

  return (
    <section id="our-product" className="py-12 sm:py-20 bg-[#E8ECF1] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        {/* Pitch deck style card with teal left border */}
        <div className="bg-white rounded-sm shadow-md border-l-4 border-[#2A8C8F] p-6 sm:p-10">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[#0C2340] font-bold">Our Product</h2>
            <div className="w-20 sm:w-24 h-1 bg-[#2A8C8F] mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-2 md:order-1 flex items-center justify-center"
            >
              <div className="rounded-sm mx-auto">
                <img
                  src={productImage}
                  alt="LapRotator V23 laparoscope rotation device"
                  className="w-full"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4 text-[#0C2340] font-bold">
                LapRotator
              </h3>
              <p className="text-lg sm:text-xl text-[#2A8C8F] font-medium mb-4 sm:mb-6">One-Handed Laparoscope Rotation</p>

              <div className="bg-[#E8ECF1] rounded-sm p-4 sm:p-6 mb-6 sm:mb-8">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                The LapRotator is an attachment for laparoscopes that enables single-handed
                rotation, providing enhanced control and flexibility during procedures.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 group"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#2A8C8F] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
