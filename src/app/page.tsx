import { HeroCarousel } from '@/components/home/HeroCarousel';
import { VideoOverlay } from '@/components/home/VideoOverlay';
import { TeamHighlight } from '@/components/home/TeamHighlight';
import { Mission } from '@/components/sections/Mission';

export default function HomePage() {
  return (
    <>
      <VideoOverlay />
      <HeroCarousel />
      <Mission />
      <TeamHighlight />
    </>
  );
}
