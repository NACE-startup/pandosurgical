import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing the use of the Pando Surgical website.',
  alternates: { canonical: '/terms' },
  openGraph: { url: '/terms', images: ['/og-image.png'] },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Use" />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              <T>Last updated: August 2026</T>
            </p>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Purpose of this site</T>
              </h2>
              <p>
                <T>
                  {
                    'This website is provided by Pando Surgical, Inc. for general informational purposes about our company and the devices we are developing, including the LapRotator. Content on this site does not constitute medical advice, and devices described may not yet be commercially available or cleared for sale in all regions.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Intellectual property</T>
              </h2>
              <p>
                <T>
                  {
                    'The Pando Surgical name, logo, and site content are the property of Pando Surgical, Inc. and may not be reproduced without permission.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>No warranty</T>
              </h2>
              <p>
                <T>
                  {
                    'This site is provided "as is" without warranties of any kind. We make reasonable efforts to keep information accurate and up to date but do not guarantee completeness or accuracy at all times.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Contact</T>
              </h2>
              <p>
                <T>Questions about these terms can be sent to</T>{' '}
                <a href="mailto:contact@pandosurgical.com" className="text-teal hover:underline">
                  contact@pandosurgical.com
                </a>
                .
              </p>
            </div>
        </div>
      </section>
    </>
  );
}
