'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CarouselDots } from '@/components/CarouselDots';
import { useEmblaAutoplay } from '@/lib/useEmblaAutoplay';
import { useLanguage } from '@/lib/LanguageContext';
import productImage from '@/assets/laprotator-product-2.png';
import mfcPhoto from '@/assets/mfc-award-photo.jpg';

type Slide = {
  image: typeof productImage;
  alt: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  ctaLabel: string;
  ctaHref: string;
  objectPositionClassName?: string;
};

const slides: Slide[] = [
  {
    image: productImage,
    alt: 'The LapRotator device',
    eyebrow: 'Pando Surgical',
    headline: 'LapRotator',
    subhead: 'One-handed laparoscope rotation',
    ctaLabel: 'Learn more',
    ctaHref: '/product',
    // The device sits right-of-center and toward the top of the source photo, so narrow (mostly-cropped)
    // viewports need the visible window pulled toward the right to keep it in frame, and every breakpoint
    // needs some headroom above center so the top of the device isn't clipped by the frame edge.
    objectPositionClassName: 'object-[78%_38%] sm:object-[68%_38%] lg:object-[58%_38%] xl:object-[50%_38%]',
  },
  {
    image: mfcPhoto,
    alt: "The Pando Surgical team celebrating at USC Viterbi's MEPC & MFC Awards Night",
    eyebrow: 'News',
    headline: '2nd Place, USC Viterbi MFC',
    subhead: 'We won the live pitch round with the LapRotator.',
    ctaLabel: 'Read more',
    ctaHref: '/news',
    objectPositionClassName: 'object-[50%_25%]',
  },
];

export function HeroCarousel() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const autoplayHandlers = useEmblaAutoplay(emblaApi, { delay: 6000, enabled: !reduced });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-mist py-4 sm:py-6" aria-label={t('Pando Surgical highlights')}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="relative isolate z-20 rounded-2xl sm:rounded-3xl overflow-hidden" {...autoplayHandlers}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={index} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="relative h-[60vh] sm:h-[65vh] min-h-[400px] max-h-[640px] w-full overflow-hidden">
                    <img
                      src={slide.image.src}
                      alt={t(slide.alt)}
                      className={`absolute inset-0 w-full h-full object-cover ${slide.objectPositionClassName ?? ''}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/10" />
                    <div className="relative z-10 h-full px-6 sm:px-10 md:px-14 flex flex-col justify-center">
                      <span className="text-teal text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
                        {t(slide.eyebrow)}
                      </span>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 max-w-xl">{t(slide.headline)}</h1>
                      <p className="text-gray-200 text-base sm:text-lg mb-8 max-w-md">{t(slide.subhead)}</p>
                      <Link
                        href={slide.ctaHref}
                        className="inline-block w-fit px-6 sm:px-8 py-3 sm:py-3.5 bg-teal hover:bg-teal-hover text-white rounded-sm font-medium transition-colors text-sm sm:text-base"
                      >
                        {t(slide.ctaLabel)}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label={t('Previous slide')}
            className="absolute bottom-4 sm:bottom-6 left-2 sm:left-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label={t('Next slide')}
            className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <CarouselDots
            count={slides.length}
            selected={selected}
            onSelect={(index) => emblaApi?.scrollTo(index)}
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20"
            dotClassName="bg-white/40"
            activeDotClassName="bg-white"
          />
        </div>
      </div>
    </section>
  );
}
