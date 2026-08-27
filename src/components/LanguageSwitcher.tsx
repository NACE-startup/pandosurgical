'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { languages, type Language } from '@/lib/i18n';
import { useLanguage } from '@/lib/LanguageContext';

interface LanguageSwitcherProps {
  language: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export function LanguageSwitcher({ language, onChange, className = '' }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === language) ?? languages[0];

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-gray-700 hover:text-navy transition-colors text-sm px-2 py-1.5 rounded-sm"
        aria-label={t('Change language')}
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{current.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-sm shadow-lg border border-navy/8 py-1 min-w-[150px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-mist transition-colors ${
                lang.code === language ? 'text-navy font-medium bg-mist' : 'text-gray-700'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
