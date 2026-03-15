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
  const [bgColor, setBgColor] = useState('#000000');
  const isPortrait = useIsPortrait();

  const videoSrc = isPortrait ? '/intro-mobile.mp4' : '/intro.mp4';

  const handleVideoEnd = useCallback(() => {
    if (hasEnded.current) return;
    hasEnded.current = true;
    onLoadingComplete();
  }, [onLoadingComplete]);

  const sampleEdgeColor = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const corners = [
        ctx.getImageData(0, 0, 1, 1).data,
        ctx.getImageData(video.videoWidth - 1, 0, 1, 1).data,
        ctx.getImageData(0, video.videoHeight - 1, 1, 1).data,
        ctx.getImageData(video.videoWidth - 1, video.videoHeight - 1, 1, 1).data,
      ];

      const r = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
      const g = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
      const b = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);

      setBgColor(`rgb(${r},${g},${b})`);
    } catch {
      // CORS or other error — keep default black
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    sampleEdgeColor();
    videoRef.current?.play().catch(() => {
      handleVideoEnd();
    });
  }, [handleVideoEnd, sampleEdgeColor]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <video
        ref={videoRef}
        key={videoSrc}
        className="max-h-full max-w-full object-contain"
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
