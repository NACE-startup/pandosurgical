import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import logoImage from 'figma:asset/0c6f0bb1f894e59d5c97c02e2b86e66e1b5d65e8.png';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20' : 'bg-white/50 backdrop-blur-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => scrollToSection('home')}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Glass-morphic logo container with actual logo */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/60 p-1.5">
              <img src={logoImage} alt="Pando Surgical" className="w-full h-full object-contain" />
            </div>
            {/* Golden glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4A24A]/40 to-transparent blur-md -z-10 opacity-70" />
          </div>
          <span className="text-xl tracking-tight bg-gradient-to-r from-[#1E293B] to-[#334155] bg-clip-text text-transparent">
            Pando Surgical
          </span>
        </motion.div>

        <nav className="flex items-center gap-8">
          {['Home', 'LapRotator', 'Our Team', 'Contact'].map((item, index) => (
            <motion.button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
              className="text-gray-700 hover:text-gray-900 transition-colors relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] group-hover:w-full transition-all duration-300" />
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}