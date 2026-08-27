'use client';

import Link from 'next/link';
import { Linkedin, Youtube } from 'lucide-react';
import pandoLogo from '@/assets/pando-logo.png';
import { useLanguage } from '@/lib/LanguageContext';

const footerColumns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'LapRotator', href: '/product' },
      { label: 'ENT Product', href: '/product/ent' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/company' },
      { label: 'Team', href: '/team' },
      { label: 'News', href: '/news' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'Investors', href: '/investors' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

const legalLinks = [
  { label: 'Privacy Notice', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Accessibility Statement', href: '/accessibility' },
];

const locations = ['Los Angeles, CA', 'Salt Lake City, UT', 'Houston, TX', 'Iowa City, Iowa', 'Tokyo, Japan'];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative isolate z-20 bg-navy text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 pb-10 sm:pb-12">
          <div className="col-span-2 md:col-span-2 pr-4">
            <img src={pandoLogo.src} alt="Pando Surgical" className="h-9 sm:h-10 w-auto" />
            <p className="text-gray-400 text-sm mt-4 max-w-xs">
              {t('Est. 2025 | Making surgical tools equitable, efficient, and ergonomic.')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.linkedin.com/company/pandosurgical/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-teal transition-colors duration-300 group"
                aria-label={t('Follow Pando Surgical on LinkedIn')}
              >
                <Linkedin className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
              </a>
              <a
                href="https://www.youtube.com/@PandoSurgical"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-teal transition-colors duration-300 group"
                aria-label={t('Watch Pando Surgical on YouTube')}
              >
                <Youtube className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white text-sm font-semibold tracking-wide mb-4">{t(col.heading)}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 pt-6">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
              {t(link.label)}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-center sm:text-left">
          <p className="text-gray-400 text-xs sm:text-sm">{t('© 2026 Pando Surgical, Inc. All rights reserved.')}</p>
          <p className="text-gray-400 text-xs sm:text-sm flex flex-wrap justify-center sm:justify-end gap-x-2 gap-y-1">
            {locations.map((location, index) => (
              <span key={location}>
                {t(location)}
                {index < locations.length - 1 && <span className="text-gray-600 ml-2">·</span>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
