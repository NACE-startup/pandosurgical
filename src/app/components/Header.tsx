import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon } from 'lucide-react';
import logoImage from '@/assets/0c6f0bb1f894e59d5c97c02e2b86e66e1b5d65e8.png';
import { LoginModal } from './LoginModal';
import { Dashboard } from './Dashboard';
import { onAuthChange, User } from '@/lib/firebase';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      if (currentUser && loginModalOpen) {
        setLoginModalOpen(false);
        setDashboardOpen(true);
      }
    });
    return () => unsubscribe();
  }, [loginModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || loginModalOpen || dashboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, loginModalOpen, dashboardOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    if (user) {
      setDashboardOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const navItems = [
    { label: 'Our Product', id: 'our-product' },
    { label: 'Surgeons', id: 'surgeons' },
    { label: 'Our Team', id: 'our-team' },
    { label: 'Mission', id: 'mission' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-[#2A8C8F]/20'
          : 'bg-[#E8ECF1]/80 backdrop-blur-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => scrollToSection('home')}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/60 p-1 sm:p-1.5">
                <img src={logoImage} alt="Pando logo" className="w-full h-full object-contain" />
            </div>
          </div>
            <span className="text-lg sm:text-xl tracking-tight font-medium text-[#0C2340]">
            Pando
          </span>
        </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-[#0C2340] transition-colors relative group text-sm lg:text-base"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2A8C8F] group-hover:w-full transition-all duration-300" />
            </motion.button>
          ))}
        </nav>

          {/* Right side: login circle + mobile menu */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleLogoClick}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#0C2340] text-white hover:bg-[#1A3A5C] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={user ? "Open dashboard" : "Open login"}
            >
              {user ? (
                <>
                  <span className="text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </>
              ) : (
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </motion.button>

          <motion.button
              className="md:hidden p-2 rounded-sm bg-gray-100 text-gray-700 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
          </div>
      </div>
    </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-[60px] left-0 right-0 bg-white/95 backdrop-blur-xl z-40 md:hidden border-b border-gray-200/30 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col p-4" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-700 hover:text-[#0C2340] hover:bg-[#2A8C8F]/10 transition-all py-4 px-4 text-left text-lg rounded-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <Dashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        user={user}
      />
    </>
  );
}
