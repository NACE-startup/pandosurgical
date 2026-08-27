import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How Pando Surgical collects, uses, and protects information.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Notice" />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              <T>Last updated: August 2026</T>
            </p>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Information we collect</T>
              </h2>
              <p>
                <T>
                  {
                    'When you use our contact form, we collect the name, email address, and message you provide so we can respond to your inquiry. We do not require an account or collect payment information on this site. We use aggregated, anonymous performance data (such as page load metrics) to help us keep the site running smoothly.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>How we use it</T>
              </h2>
              <p>
                <T>
                  {
                    'Information submitted through our contact form is used only to respond to your message and is not sold or shared with third parties for marketing purposes.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Cookies</T>
              </h2>
              <p>
                <T>
                  {
                    'This site does not use advertising or tracking cookies. Basic, privacy-preserving analytics may be used to understand overall site usage.'
                  }
                </T>
              </p>
            </div>

            <div>
              <h2 className="text-navy font-heading font-semibold text-lg mb-2">
                <T>Contact</T>
              </h2>
              <p>
                <T>Questions about this notice can be sent to</T>{' '}
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
