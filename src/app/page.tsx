import { HeroCarousel } from '@/components/home/HeroCarousel';
import { VideoOverlay } from '@/components/home/VideoOverlay';
import { Mission } from '@/components/sections/Mission';

export default function HomePage() {
  return (
    <>
      <VideoOverlay />
      <HeroCarousel />
      <Mission />
    </>
  );
}
