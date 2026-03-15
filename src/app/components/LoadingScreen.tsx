import { motion } from 'motion/react';
import { useRef, useCallback, useState, useMemo } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

function useIsPortrait() {
  const mql = typeof window !== 'undefined'
    ? window.matchMedia('(orientation: portrait)')
    : null;
  const [portrait, setPortrait] = useState(mql?.matches ?? false);

  useMemo(() => {
    if (!mql) return;
    const handler = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mql]);

  return portrait;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEnded = useRef(false);
  const isPortrait = useIsPortrait();

  const videoSrc = isPortrait ? '/intro-mobile.mp4' : '/intro.mp4';

  const handleVideoEnd = useCallback(() => {
    if (hasEnded.current) return;
    hasEnded.current = true;
    onLoadingComplete();
  }, [onLoadingComplete]);

  const handleCanPlay = useCallback(() => {
    videoRef.current?.play().catch(() => {
      handleVideoEnd();
    });
  }, [handleVideoEnd]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <video
        ref={videoRef}
        key={videoSrc}
        className="h-full w-full object-cover"
        src={videoSrc}
        muted
        playsInline
        autoPlay
        preload="auto"
        onCanPlay={handleCanPlay}
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
      />
    </motion.div>
  );
}
