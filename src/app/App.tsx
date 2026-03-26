import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Product } from './components/Product';
import { Comparison } from './components/Comparison';
import { Team } from './components/Team';
import { Mission } from './components/Mission';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative bg-[#E8ECF1]">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Header />
          <Hero />
          <Comparison />
          <Product />
          <Team />
          <Mission />
          <Contact />
          <Footer />
        </motion.div>
      )}
      <SpeedInsights />
    </div>
  );
}
