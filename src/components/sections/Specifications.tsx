'use client';

import { useLanguage } from '@/lib/LanguageContext';

const compatibility = [
  {
    label: 'Laparoscopes (Standard Autoclavable, 30 cm)',
    detail: '502-555-010/030/045 (5.0 mm); 502-457-010/030/045 (10.0 mm)'
  },
  {
    label: 'IDEAL EYES™ HD (30 cm)',
    detail: '502-539-010/030/045 (5.0 mm); 502-859-010/030/045 (10.0 mm)'
  },
  {
    label: 'Bariatric (45 cm)',
    detail: '502-205-010/030/045 (5.0 mm)'
  },
  {
    label: 'Pediatric',
    detail: '502-543-010/030 (2.7 mm); 502-290-010/030 (2.9 mm, IDEAL EYES™)'
  }
];

export function Specifications() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl">
      <h3 className="text-lg sm:text-xl font-bold text-navy mb-3">{t('Compatibility')}</h3>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
        {t('The LapRotator is compatible with the following Stryker rigid laparoscopes and camera coupler:')}
      </p>
      <dl className="space-y-4 mb-6">
        {compatibility.map((item) => (
          <div key={item.label} className="sm:flex sm:gap-2">
            <dt className="font-semibold text-navy text-sm sm:text-base sm:w-72 sm:flex-shrink-0">{t(item.label)}</dt>
            <dd className="text-gray-600 text-sm sm:text-base">{item.detail}</dd>
          </div>
        ))}
      </dl>
      <div className="pt-4 border-t border-navy/10 sm:flex sm:gap-2">
        <dt className="font-semibold text-navy text-sm sm:text-base sm:w-72 sm:flex-shrink-0">{t('Camera coupler')}</dt>
        <dd className="text-gray-600 text-sm sm:text-base">Stryker 1488 HD Camera Head Coupler, 18 mm (P/N 1488-020-122)</dd>
      </div>
    </div>
  );
}
