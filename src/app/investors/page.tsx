// TODO: gating decision (public vs. authenticated) pending — do not add real
// financial/funding content here until real materials + a gating decision exist.
import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Investors & Resources',
  description: 'Investor resources for Pando Surgical, developer of the LapRotator.',
  alternates: { canonical: '/investors' },
  openGraph: { url: '/investors' },
};

const resources = [
  { name: 'Pitch Deck', status: 'Coming soon' },
  { name: 'Financial Overview', status: 'Coming soon' },
  { name: 'Press Kit', status: 'Coming soon' },
];

export default function InvestorsPage() {
  return (
    <>
      <PageHeader
        title="Investors & Resources"
        subtitle="Investor materials are coming soon."
      />

      <section className="pb-10 sm:pb-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <p className="text-gray-500 italic text-sm sm:text-base leading-relaxed">
            <T>
              {
                "We'll be opening up our seed round soon. Check back here for updates, or reach out directly if you'd like to learn more."
              }
            </T>
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-navy/10">
            {resources.map((resource) => (
              <div key={resource.name} className="py-6 sm:py-2 sm:px-8 first:pt-0 sm:first:pl-0 text-center">
                <p className="text-navy font-bold mb-2">
                  <T>{resource.name}</T>
                </p>
                <p className="text-gray-400 text-sm italic">
                  <T>{resource.status}</T>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Interested in learning more?"
        actions={[{ label: 'Contact Us', href: '/contact' }]}
      />
    </>
  );
}
