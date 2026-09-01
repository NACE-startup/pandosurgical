import type { Metadata } from 'next';
import { T } from '@/components/T';
import entSurgeryPhoto from '@/assets/ent-black.jpg';

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
        src={entSurgeryPhoto.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-100"
      />
      {/* Film-grain texture in place of a flat dark overlay, generated inline so it needs no extra image request */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-teal/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 w-[24rem] h-[24rem] sm:w-[32rem] sm:h-[32rem] rounded-full bg-teal/10 blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
          <T>Ergonomic ENT Product</T>
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-teal font-medium mb-5 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
          <T>In Stealth</T>
        </p>
        <p className="text-gray-100 text-base sm:text-lg leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
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
