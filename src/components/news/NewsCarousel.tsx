'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CarouselDots } from '@/components/CarouselDots';
import { useEmblaAutoplay } from '@/lib/useEmblaAutoplay';
import { useLanguage } from '@/lib/LanguageContext';
import { getNewsPosts, NewsPost } from '@/lib/firebase';
import mfcPhoto from '@/assets/mfc-award-photo.jpg';
import patentPhoto from '@/assets/laprotator-patent-crop.png';
import bullPhoto from '@/assets/wsbull.jpg';
import uscTechstarsPhoto from '@/assets/usc-techstars-catalyst.jpg';

interface NewsSlide {
  key: string;
  headline: string;
  body: string;
  photoSrc: string;
  photoAlt: string;
  photoObjectPosition?: string;
  photoCredit?: { label: string; href: string };
  textOffsetClassName?: string;
}

const curatedNewsItems: NewsSlide[] = [
  {
    key: 'usc-techstars-catalyst',
    headline: 'Accepted into USC and Techstars University Catalyst Pre-Accelerator',
    body: 'Pando Surgical has officially been accepted into the USC and Techstars University Catalyst Pre-Accelerator, a high-impact program delivered in partnership with the USC Research and Innovation office. The program officially launched in late August in Los Angeles, bringing together the Pando Surgical leadership team, program directors, and a select cohort of fellow founders for collaborative kickoff sessions. Over the coming weeks, the company will engage in intensive mentorship and strategic development to accelerate its commercialization pathway alongside top-tier, research-backed ventures.',
    photoSrc: uscTechstarsPhoto.src,
    photoAlt: 'USC campus tower, marking the USC and Techstars University Catalyst Pre-Accelerator',
  },
  {
    key: 'mfc-2026',
    headline: '2nd Place, USC Viterbi Min Family Challenge',
    body: "The Min Family Challenge (MFC) is USC Viterbi's flagship student venture competition, part of tiehub's annual $150K Awards Night, awarding funding to student-founded startups with the strongest potential for real-world impact. At the 2026 MEPC & MFC Awards Night on April 27, our team placed 2nd overall and was also selected by audience vote as one of three finalists to deliver a live three-minute pitch, which we won, bringing a working prototype of the LapRotator to the stage.",
    photoSrc: mfcPhoto.src,
    photoAlt: "The Pando Surgical team celebrating at USC Viterbi's MEPC & MFC Awards Night",
    photoObjectPosition: 'center 20%',
  },
  {
    key: 'pre-seed',
    headline: 'Closed $60K Pre-Seed Round',
    body: "We closed a $60,000 pre-seed round to fund our utility patent filing and kick off the FDA regulatory process, including the testing needed to support that submission. Thank you to everyone who believed in what we're building this early on.",
    photoSrc: bullPhoto.src,
    photoAlt: 'The Charging Bull statue near Wall Street',
    photoCredit: { label: 'Photo: The Wall Street Experience', href: 'https://www.thewallstreetexperience.com/blog/story-behind-legendary-charging-bull/' },
  },
  {
    key: 'utility-patent',
    headline: 'Filing Our Utility Patent',
    body: "We're working with patent counsel to file a utility patent protecting the core LapRotator mechanism, covering the one-handed rotation drive and control interface. The application is in preparation now, and we expect to submit it soon.",
    photoSrc: patentPhoto.src,
    photoAlt: 'Close-up of the LapRotator control handle',
  },
];

export function NewsCarousel() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [dashboardPosts, setDashboardPosts] = useState<NewsPost[]>([]);

  useEffect(() => {
    getNewsPosts().then(setDashboardPosts);
  }, []);

  // Newest dashboard-published posts lead, followed by the hand-curated milestones below.
  const newsItems: NewsSlide[] = [
    ...dashboardPosts.map((post): NewsSlide => ({
      key: post.id!,
      headline: post.headline,
      body: post.body,
      photoSrc: post.photoUrl,
      photoAlt: post.headline,
    })),
    ...curatedNewsItems,
  ];

  const autoplayHandlers = useEmblaAutoplay(emblaApi, { delay: 5000, enabled: !reduced });

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

  // Embla measures slides on init, so it needs to be told to remeasure once
  // the dashboard-published posts load in and change the slide count.
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, newsItems.length]);

  return (
    <section className="pb-12 sm:pb-20 bg-mist">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
        <div className="relative isolate z-20" {...autoplayHandlers}>
          <div className="overflow-hidden rounded-sm" ref={emblaRef}>
            <div className="flex">
              {newsItems.map((item, index) => (
                <div key={item.key} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="relative bg-navy h-full min-h-[640px] sm:min-h-[480px] grid grid-cols-1 sm:grid-cols-2">
                    <div className="relative min-w-0 h-[220px] sm:h-full">
                      <img
                        src={item.photoSrc}
                        alt={t(item.photoAlt)}
                        className="w-full h-full object-cover"
                        style={item.photoObjectPosition ? { objectPosition: item.photoObjectPosition } : undefined}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      {item.photoCredit && (
                        <a
                          href={item.photoCredit.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 transition-colors text-white/80 hover:text-white text-[10px] sm:text-xs px-2 py-1 rounded-sm"
                        >
                          {t(item.photoCredit.label)}
                        </a>
                      )}
                    </div>
                    <div className={`min-w-0 self-center p-8 sm:p-14 ${item.textOffsetClassName ?? ''}`}>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{t(item.headline)}</h2>
                      <p className="text-gray-300 text-sm sm:text-base">{t(item.body)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label={t('Previous news item')}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-navy hover:bg-mist transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label={t('Next news item')}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-navy hover:bg-mist transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <CarouselDots
            count={newsItems.length}
            selected={selected}
            onSelect={(index) => emblaApi?.scrollTo(index)}
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}
