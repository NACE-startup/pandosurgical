import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Team } from '@/components/sections/Team';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the founders and advisors building Pando Surgical, a team of USC Biomedical Engineers and clinical advisors developing the LapRotator.',
  alternates: { canonical: '/team' },
  openGraph: { url: '/team' },
};

export default function TeamPage() {
  return (
    <>
      <PageHeader eyebrow="Our People" title="Our Team" />
      <Team />
    </>
  );
}
