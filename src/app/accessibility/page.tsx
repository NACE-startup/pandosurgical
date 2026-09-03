import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: "Pando Surgical's commitment to an accessible website.",
  alternates: { canonical: '/accessibility' },
  openGraph: { url: '/accessibility', images: ['/og-image.png'] },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader title="Accessibility Statement" />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              <T>Last updated: August 2026</T>
            </p>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Our commitment</T>
              </h2>
              <p>
                <T>
                  {
                    'Pando Surgical is committed to making our website usable by as many people as possible, including people with disabilities. We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA as a general standard for our site.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Ongoing work</T>
              </h2>
              <p>
                <T>
                  {
                    'As a small, growing team, we are continuously improving the accessibility of this site, including color contrast, keyboard navigation, and screen reader support, as we add new pages and features.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Feedback</T>
              </h2>
              <p>
                <T>If you encounter any accessibility barriers on this site, please let us know at</T>{' '}
                <a href="mailto:contact@pandosurgical.com" className="text-teal hover:underline">
                  contact@pandosurgical.com
                </a>{' '}
                <T>so we can address them.</T>
              </p>
            </div>
        </div>
      </section>
    </>
  );
}
