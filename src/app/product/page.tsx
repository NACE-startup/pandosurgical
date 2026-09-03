import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Product } from '@/components/sections/Product';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'LapRotator | One-Handed Laparoscope Rotation',
  description:
    'The LapRotator attaches to existing laparoscopic systems for intuitive one-handed rotation, giving surgeons enhanced control and reduced fatigue.',
  alternates: { canonical: '/product' },
  openGraph: { url: '/product', images: ['/og-image.png'] },
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'LapRotator',
  description:
    'One-handed laparoscope rotation device enabling precise motion control for minimally invasive surgery. Compatible with existing laparoscopic systems.',
  brand: { '@type': 'Brand', name: 'Pando Surgical' },
  manufacturer: {
    '@type': 'Organization',
    name: 'Pando Surgical',
    url: 'https://www.pandosurgical.com',
  },
  category: 'Medical Device',
  url: 'https://www.pandosurgical.com/product',
  image: 'https://www.pandosurgical.com/og-image.png',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/PreOrder',
    priceCurrency: 'USD',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the LapRotator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The LapRotator is an innovative attachment for laparoscopes that enables surgeons to rotate the scope with one hand, providing enhanced control and flexibility during minimally invasive surgical procedures.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the LapRotator compatible with existing laparoscopic systems?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, the LapRotator is designed to seamlessly integrate with your existing laparoscopic systems. It's a universal attachment that works with standard laparoscope equipment.",
      },
    },
    {
      '@type': 'Question',
      name: 'What are the benefits of using the LapRotator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The LapRotator offers several benefits: one-handed rotation for enhanced control, reduced surgeon fatigue during procedures, intuitive operation requiring minimal training, compact and lightweight design, and improved ergonomics during surgery.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I contact Pando Surgical?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Pando Surgical by emailing contact@pandosurgical.com or by filling out the contact form on our website at www.pandosurgical.com.',
      },
    },
  ],
};

export default function ProductPage() {
  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={faqJsonLd} />
      <PageHeader
        title="LapRotator"
        subtitle="One-Handed Laparoscope Rotation: an attachment for laparoscopes that gives surgeons intuitive, single-handed control."
        align="center"
      />
      <Product />
    </>
  );
}
