import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  const { scrollY } = useScroll();
  
  // Fade out as user scrolls down (0-300px range)
  // Fade in when scrolled back to top
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{ opacity }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-[#D4A24A] opacity-60 rounded-full" />
        
        {/* Icon */}
        <div className="relative bg-[#D4A24A] rounded-full p-3 shadow-2xl">
          <ChevronDown className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
      </motion.div>
    </motion.div>
  );
}