import { motion } from 'motion/react';
import { useRef, useCallback } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEnded = useRef(false);

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
        className="h-full w-full object-cover"
        src="/intro.mp4"
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
