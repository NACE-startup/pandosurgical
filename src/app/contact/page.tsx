import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Contact } from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Pando Surgical about the LapRotator: product information, demo requests, partnership opportunities, and support.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" />
      <Contact />
    </>
  );
}
