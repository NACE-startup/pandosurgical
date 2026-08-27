import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import { JsonLd } from '@/components/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

const siteUrl = 'https://www.pandosurgical.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pando Surgical | One-Handed Laparoscope Rotation Device',
    template: '%s | Pando Surgical',
  },
  description:
    "Pando Surgical's LapRotator enables simple, intuitive laparoscope rotation for surgeons. Experience precise one-handed motion control in minimally invasive surgery.",
  keywords: [
    'laparoscope rotation',
    'laparoscopic surgery',
    'surgical instruments',
    'LapRotator',
    'minimally invasive surgery',
    'surgical technology',
    'Pando Surgical',
    'medical device',
    'surgical innovation',
    'one-handed laparoscope',
    'surgeon ergonomics',
  ],
  authors: [{ name: 'Pando Surgical' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Pando Surgical | One-Handed Laparoscope Rotation Device',
    description:
      "Pando Surgical's LapRotator enables simple, intuitive laparoscope rotation for surgeons. Experience precise one-handed motion control in minimally invasive surgery.",
    siteName: 'Pando Surgical',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pando Surgical LapRotator - One-handed laparoscope rotation device',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pando Surgical | One-Handed Laparoscope Rotation Device',
    description:
      "Pando Surgical's LapRotator enables simple, intuitive laparoscope rotation for surgeons. Experience precise one-handed motion control in minimally invasive surgery.",
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-180.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pando Surgical',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'geo.region': 'US-CA',
    'geo.placename': 'Los Angeles',
    'msapplication-TileColor': '#0C2340',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C2340',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pando Surgical',
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  description:
    'Pando Surgical develops innovative laparoscopic surgical instruments for minimally invasive procedures, including the LapRotator for one-handed scope rotation.',
  foundingDate: '2024',
  foundingLocation: 'Los Angeles, California',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@pandosurgical.com',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  sameAs: ['https://www.linkedin.com/company/pandosurgical'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Pando Surgical',
  url: siteUrl,
  description: 'Official website of Pando Surgical - Innovative laparoscopic surgical instruments',
};

const medicalBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Pando Surgical',
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  description: 'Medical device startup developing innovative laparoscopic surgical instruments',
  email: 'contact@pandosurgical.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={medicalBusinessJsonLd} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
