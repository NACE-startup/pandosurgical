import type { Metadata } from 'next';
import { T } from '@/components/T';
import patentPhoto from '@/assets/laprotator-patent-crop.png';

export const metadata: Metadata = {
  title: 'ENT Product',
  description: 'Pando Surgical is developing a new ergonomic ENT product, currently in stealth.',
  alternates: { canonical: '/product/ent' },
  openGraph: { url: '/product/ent' },
};

export default function EntProductPage() {
  return (
    <section className="relative overflow-hidden bg-navy min-h-screen flex items-center pt-28 sm:pt-36 pb-16 sm:pb-24">
      <img
        src={patentPhoto.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-60"
      />
      <div className="absolute inset-0 bg-navy/80" />
      <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-teal/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 w-[24rem] h-[24rem] sm:w-[32rem] sm:h-[32rem] rounded-full bg-teal/10 blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          <T>Ergonomic ENT Product</T>
        </h1>
        <div className="w-20 sm:w-24 h-0.5 bg-teal rounded-full mx-auto mb-8" />
        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-teal font-medium mb-5">
          <T>In Stealth</T>
        </p>
        <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
          <T>
            {
              "We're developing a new ergonomic solution for ENT procedures. The product is currently in stealth, so details are under wraps for now. Check back soon."
            }
          </T>
        </p>
      </div>
    </section>
  );
}
