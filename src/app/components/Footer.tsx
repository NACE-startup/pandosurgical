import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import logoImage from 'figma:asset/0c6f0bb1f894e59d5c97c02e2b86e66e1b5d65e8.png';

export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <img src={logoImage} alt="Pando Surgical" className="w-8 h-8" />
          </motion.div>
          
          {/* LinkedIn Icon */}
          <motion.a
            href="https://www.linkedin.com/company/pandosurgical/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A24A]/20 hover:bg-[#D4A24A] transition-colors duration-300 group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-5 h-5 text-[#D4A24A] group-hover:text-white transition-colors duration-300" />
          </motion.a>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A24A] to-transparent" />
          
          <p className="text-gray-400 text-center">
            © 2026 Pando Surgical, LLC. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}