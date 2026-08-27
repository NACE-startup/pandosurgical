'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import pandoLogo from '@/assets/pando-logo.png';
import { onAuthChange, User } from '@/lib/firebase';
import { useLanguage } from '@/lib/LanguageContext';
import { translateExpandAria, type Language } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBox } from './SearchBox';

const LoginModal = dynamic(() => import('./LoginModal').then((m) => m.LoginModal), { ssr: false });
const Dashboard = dynamic(() => import('./Dashboard').then((m) => m.Dashboard), { ssr: false });

type NavLeaf = { label: string; href: string };
type NavItem = { label: string; href?: string; dropdown?: NavLeaf[] };

const navItems: NavItem[] = [
  {
    label: 'Product',
    href: '/product',
    dropdown: [
      { label: 'LapRotator', href: '/product' },
      { label: 'ENT Product', href: '/product/ent' },
    ],
  },
  { label: 'Team', href: '/team' },
  { label: 'News', href: '/news' },
  {
    label: 'About',
    dropdown: [
      { label: 'Company', href: '/company' },
      { label: 'Investors', href: '/investors' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { language, setLanguage: handleLanguageChange, t } = useLanguage();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  useEffect(() => {
    if (!mobileMenuOpen) setExpandedGroup(null);
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleAvatarClick = () => {
    if (user) {
      setDashboardOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleDropdownEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const isItemActive = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.dropdown) return item.dropdown.some((sub) => pathname === sub.href);
    return false;
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled ? 'bg-mist shadow-sm border-b border-navy/8' : 'bg-mist'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <img src={pandoLogo.src} alt="Pando Surgical" className="h-9 sm:h-11 w-auto" />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation — centered via the grid's auto middle column */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 justify-self-center" aria-label={t('Main navigation')}>
            {navItems.map((item, index) => {
              const active = isItemActive(item);
              const hasDropdown = !!item.dropdown;
              const triggerClassName = `flex items-center gap-1 text-gray-700 hover:text-navy transition-colors relative group text-sm lg:text-base whitespace-nowrap ${
                active ? 'text-navy' : ''
              }`;

              return (
                <motion.div
                  key={item.label}
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => hasDropdown && handleDropdownEnter(item.label)}
                  onMouseLeave={() => hasDropdown && handleDropdownLeave()}
                >
                  {item.href ? (
                    <Link href={item.href} className={triggerClassName}>
                      {t(item.label)}
                      {hasDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-teal transition-all duration-300 ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </Link>
                  ) : (
                    <button type="button" className={triggerClassName}>
                      {t(item.label)}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-teal transition-all duration-300 ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>
                  )}

                  <AnimatePresence>
                    {hasDropdown && openDropdown === item.label && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="bg-mist rounded-sm shadow-sm px-1 py-1 flex flex-row items-center gap-1 whitespace-nowrap">
                          {item.dropdown!.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`px-3 py-2 text-sm text-gray-700 hover:text-navy hover:bg-navy/5 rounded-sm transition-colors ${
                                pathname === sub.href ? 'text-navy font-medium' : ''
                              }`}
                            >
                              {t(sub.label)}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* Right side: search, language, login, mobile menu */}
          <div className="justify-self-end flex items-center gap-2 sm:gap-3">
            <SearchBox placeholder={t('Search...')} className="hidden md:block" />

            <LanguageSwitcher language={language} onChange={handleLanguageChange} className="hidden md:block" />

            <motion.button
              onClick={handleAvatarClick}
              className="text-sm font-medium text-gray-700 hover:text-navy hover:bg-white/60 transition-colors px-3 py-2.5 -mx-1 rounded-sm"
              whileTap={{ scale: 0.97 }}
              aria-label={t(user ? 'Open dashboard' : 'Open login')}
            >
              {user ? t('Dashboard') : t('Log in')}
            </motion.button>

            <motion.button
              className="md:hidden p-2 rounded-sm bg-gray-100 text-gray-700 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={t(mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-16 left-0 right-0 bg-mist z-40 md:hidden border-b border-navy/10 shadow-md max-h-[calc(100dvh-4rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 pb-2">
                <SearchBox expanded placeholder={t('Search...')} onNavigate={() => setMobileMenuOpen(false)} />
              </div>

              <nav className="flex flex-col p-4 pt-0" aria-label={t('Mobile navigation')}>
                {navItems.map((item, index) => {
                  const active = isItemActive(item);
                  const hasDropdown = !!item.dropdown;
                  const isExpanded = expandedGroup === item.label;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-center">
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex-1 text-gray-700 hover:text-navy hover:bg-teal/10 transition-all py-4 px-4 text-left text-lg rounded-sm ${
                              active ? 'text-navy bg-teal/10' : ''
                            }`}
                          >
                            {t(item.label)}
                          </Link>
                        ) : (
                          <span className={`flex-1 py-4 px-4 text-left text-lg ${active ? 'text-navy' : 'text-gray-700'}`}>
                            {t(item.label)}
                          </span>
                        )}
                        {hasDropdown && (
                          <button
                            type="button"
                            onClick={() => setExpandedGroup(isExpanded ? null : item.label)}
                            className="p-4 text-gray-500"
                            aria-label={translateExpandAria(language, isExpanded, t(item.label))}
                            aria-expanded={isExpanded}
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {hasDropdown && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {item.dropdown!.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-3 px-4 text-base text-gray-600 hover:text-navy rounded-sm ${
                                  pathname === sub.href ? 'text-navy' : ''
                                }`}
                              >
                                {t(sub.label)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-navy/10">
                  <span className="block px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">{t('Language')}</span>
                  <div className="flex flex-col">
                    {(['en', 'es', 'zh'] as Language[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageChange(code)}
                        className={`text-left py-3 px-4 text-base rounded-sm transition-colors ${
                          language === code ? 'text-navy font-medium bg-teal/10' : 'text-gray-600 hover:text-navy'
                        }`}
                      >
                        {code === 'en' ? 'English' : code === 'es' ? 'Español' : '中文'}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {loginModalOpen && <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {dashboardOpen && <Dashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} user={user} />}
    </>
  );
}
