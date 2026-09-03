import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { InternshipApplicationForm } from '@/components/careers/InternshipApplicationForm';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Internship openings at Pando Surgical: Engineering Intern role.',
  alternates: { canonical: '/careers' },
  openGraph: { url: '/careers', images: ['/og-image.png'] },
};

export default function CareersPage() {
  return (
    <>
      <PageHeader title="Careers" subtitle="We're opening up an internship spot for an Engineering intern." />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
            <T>
              {
                "We're looking for an Engineering intern to join our team. Submit your resume and a few short answers below, and we'll be in contact with you after reviewing your application. You can also reach us directly at"
              }
            </T>{' '}
            <a href="mailto:contact@pandosurgical.com" className="text-teal hover:underline">
              contact@pandosurgical.com
            </a>
            .
          </p>

          <InternshipApplicationForm />
        </div>
      </section>
    </>
  );
}
