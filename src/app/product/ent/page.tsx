import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'ENT Product',
  description: 'Pando Surgical is developing a new ergonomic ENT product, currently in stealth.',
  alternates: { canonical: '/product/ent' },
  openGraph: { url: '/product/ent' },
};

export default function EntProductPage() {
  return (
    <>
      <PageHeader eyebrow="In Stealth" title="Ergonomic ENT Product" align="center" />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <T>
              {
                "We're developing a new ergonomic solution for ENT procedures. The product is currently in stealth, so details are under wraps for now. Check back soon."
              }
            </T>
          </p>
        </div>
      </section>

      <CtaBand title="Interested? Get in touch." actions={[{ label: 'Contact Us', href: '/contact' }]} />
    </>
  );
}
