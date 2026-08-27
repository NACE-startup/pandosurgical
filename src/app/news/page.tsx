import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { NewsCarousel } from '@/components/news/NewsCarousel';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and milestones from Pando Surgical.',
  alternates: { canonical: '/news' },
  openGraph: { url: '/news' },
};

export default function NewsPage() {
  return (
    <>
      <PageHeader title="News" />
      <NewsCarousel />
    </>
  );
}
