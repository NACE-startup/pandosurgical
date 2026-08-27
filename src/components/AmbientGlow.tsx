'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export function AmbientGlow() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    // Pause the decode/GPU work while the tab is backgrounded (battery win, no visible difference
    // since nothing is on screen anyway) and resume where it left off when the user comes back.
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [reduced]);

  return (
    <div className="ambient-glow" aria-hidden="true">
      <video
        ref={videoRef}
        className="ambient-glow__video"
        src="/ambient-glow.mp4"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
