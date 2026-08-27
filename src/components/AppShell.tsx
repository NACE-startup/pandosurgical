'use client';

import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AmbientGlow } from './AmbientGlow';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="relative bg-mist">
        <AmbientGlow />
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  );
}
