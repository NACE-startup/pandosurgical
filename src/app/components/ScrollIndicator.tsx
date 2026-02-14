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
        {/* Golden arrow icon */}
        <ChevronDown className="w-10 h-10 text-[#D4A24A] drop-shadow-lg" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  );
}