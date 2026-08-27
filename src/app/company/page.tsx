import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Mission } from '@/components/sections/Mission';
import { CtaBand } from '@/components/CtaBand';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Pando Surgical is developing the LapRotator to make laparoscopic surgery more equitable and efficient for surgeons worldwide.',
  alternates: { canonical: '/company' },
  openGraph: { url: '/company' },
};

const values = [
  {
    name: 'Equitable',
    description: 'Every surgeon deserves to feel supported. This starts with the tools they use.',
  },
  {
    name: 'Efficient',
    description: 'We design to improve surgical workflows, reducing operating time and improving patient outcomes.',
  },
  {
    name: 'Ergonomic',
    description: 'We are creating a world where the intersection between humans and technology is seamless.',
  },
];

export default function CompanyPage() {
  return (
    <>
      <PageHeader eyebrow="Our Story" title="Company" />

      <section className="pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
            <T>How Pando Surgical Started</T>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <T>
              {
                'Pando Surgical started with the mission to improve surgical ergonomics. We are a group of engineers who work closely with physicians, and we noticed that many surgical tools create unnecessary strain on surgeons because they are designed with only one anatomy in mind. As the workforce diversifies, we aim to equip every surgeon with tools that support them.'
              }
            </T>
          </p>
        </div>
      </section>

      <Mission />

      <section className="py-16 sm:py-24 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-left mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3">
              <T>What We Value</T>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-teal rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-navy/10">
            {values.map((value, index) => (
              <div key={index} className="py-6 sm:py-2 sm:px-8 first:pt-0 sm:first:pl-0 text-left">
                <p className="text-navy font-bold mb-2">
                  <T>{value.name}</T>
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <T>{value.description}</T>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Get to know the people behind Pando Surgical"
        actions={[
          { label: 'Meet the Team', href: '/team' },
          { label: 'Get in Touch', href: '/contact', variant: 'secondary' },
        ]}
      />
    </>
  );
}
