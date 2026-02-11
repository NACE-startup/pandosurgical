import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Product } from './components/Product';
import { Comparison } from './components/Comparison';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollIndicator } from './components/ScrollIndicator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </AnimatePresence>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="relative">
      <Header />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Hero />
          <ScrollIndicator />
        </motion.div>
        
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Product />
        </motion.div>
        
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Comparison />
        </motion.div>
        
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Team />
        </motion.div>
        
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Contact />
        </motion.div>
        
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "100px" }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}