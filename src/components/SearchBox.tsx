'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const searchIndex = [
  { title: 'Home', href: '/', keywords: 'home landing pando surgical' },
  { title: 'LapRotator', href: '/product', keywords: 'product laprotator laparoscope rotation one-handed' },
  { title: 'ENT Product', href: '/product/ent', keywords: 'ent product stealth ergonomic' },
  { title: 'Team', href: '/team', keywords: 'team founders aiden pan toshi nagai derek hua sean lee advisors noah pearson xiaoyang hua' },
  { title: 'News', href: '/news', keywords: 'news mfc pre-seed round patent' },
  { title: 'Company', href: '/company', keywords: 'company about mission story values' },
  { title: 'Investors', href: '/investors', keywords: 'investors resources pitch deck financial press kit' },
  { title: 'Careers', href: '/careers', keywords: 'careers jobs hiring' },
  { title: 'Contact', href: '/contact', keywords: 'contact us get in touch demo' },
];

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  /** When true, renders as an always-open full-width input (for the mobile menu) instead of an icon that expands. */
  expanded?: boolean;
  onNavigate?: () => void;
}

export function SearchBox({ placeholder = 'Search...', className = '', expanded = false, onNavigate }: SearchBoxProps) {
  const [open, setOpen] = useState(expanded);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (open && !expanded) inputRef.current?.focus();
  }, [open, expanded]);

  useEffect(() => {
    if (expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  const results = query.trim()
    ? searchIndex.filter((item) => `${item.title} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const handleSelect = (href: string) => {
    setQuery('');
    if (!expanded) setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      if (!expanded) setOpen(false);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].href);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {open ? (
        <div className={`flex items-center bg-white border border-navy/15 rounded-sm px-3 py-1.5 gap-2 ${expanded ? 'w-full' : 'w-48 sm:w-64'}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-0 text-sm outline-none text-navy placeholder:text-gray-400"
          />
          {!expanded && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setQuery('');
              }}
              aria-label={t('Close search')}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-navy transition-colors" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full text-gray-700 hover:text-navy hover:bg-white/60 transition-colors"
          aria-label={t('Search')}
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {open && query.trim() && results.length > 0 && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-sm shadow-lg border border-navy/8 py-1 z-50 max-h-64 overflow-y-auto ${
            expanded ? 'left-0 right-0' : 'right-0 w-48 sm:w-64'
          }`}
        >
          {results.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleSelect(item.href)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-navy hover:bg-mist transition-colors"
            >
              {t(item.title)}
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-sm shadow-lg border border-navy/8 py-3 px-4 z-50 text-sm text-gray-400 ${
            expanded ? 'left-0 right-0' : 'right-0 w-48 sm:w-64'
          }`}
        >
          {t('No results found.')}
        </div>
      )}
    </div>
  );
}
