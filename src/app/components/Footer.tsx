import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import logoImage from '@/assets/0c6f0bb1f894e59d5c97c02e2b86e66e1b5d65e8.png';

export function Footer() {
  return (
    <footer className="bg-[#0C2340] text-white py-6 sm:py-8 border-t-4 border-[#2A8C8F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col items-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img src={logoImage} alt="Pando Surgical logo" className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>

          <motion.a
            href="https://www.linkedin.com/company/pandosurgical/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2A8C8F]/20 hover:bg-[#2A8C8F] transition-colors duration-300 group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Follow Pando Surgical on LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A8C8F] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
          </motion.a>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2A8C8F]/50 to-transparent" />

          <p className="text-gray-400 text-center text-xs sm:text-sm px-4">
            &copy; 2026 Pando Surgical, LLC. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
