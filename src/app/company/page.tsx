import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Mission } from '@/components/sections/Mission';
import { CtaBand } from '@/components/CtaBand';
import { T } from '@/components/T';
import pitchPhoto from '@/assets/mfc-pitch-finals.jpg';

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
      <PageHeader title="Company" />

      <section className="min-h-[80vh] sm:min-h-[85vh] flex items-center bg-white pb-16 sm:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid sm:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-5 sm:mb-6">
              <T>How Pando Surgical Started</T>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              <T>
                {
                  'Pando Surgical started with the mission to improve surgical ergonomics. We are a group of engineers who work closely with physicians, and we noticed that many surgical tools create unnecessary strain on surgeons because they are designed with only one anatomy in mind. As the workforce diversifies, we aim to equip every surgeon with tools that support them.'
                }
              </T>
            </p>
          </div>
          <img
            src={pitchPhoto.src}
            alt={'Team Pando Surgical delivering the live pitch finals at the USC Viterbi MEPC & MFC Awards Night'}
            className="w-full h-80 sm:h-[32rem] object-cover rounded-sm"
          />
        </div>
      </section>

      <Mission />

      <section className="py-16 sm:py-24 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-left mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3">
              <T>What We Value</T>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-navy/10">
            {values.map((value, index) => (
              <div key={index} className="py-6 sm:py-2 sm:px-8 first:pt-0 sm:first:pt-2 sm:first:pl-0 text-left">
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
