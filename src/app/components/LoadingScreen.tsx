import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Brand */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">
            Pando Surgical
          </h1>
          <p className="text-center text-gray-500 text-sm tracking-wide">
            Simple Laparoscope Rotation
          </p>
        </motion.div>

        {/* Simple spinner */}
        <motion.div
          className="w-12 h-12 mb-8 border-3 border-gray-200 border-t-[#D4A24A] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4A24A] to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
