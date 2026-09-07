import React, { useState } from 'react';
import BrandPreloader from '../components/Home/BrandPreloader';
import Hero from '../components/Home/Hero';
import ProductGrid from '../components/Products/ProductGrid';
import HowItWorks from '../components/Home/HowItWorks';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import FAQ from '../components/Home/FAQ';

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="home-page">
      {!preloaderComplete && (
        <BrandPreloader onComplete={() => setPreloaderComplete(true)} />
      )}

      <Hero />
      <ProductGrid />
      <WhyChooseUs />
      <FAQ />
      <HowItWorks />
    </div>
  );
}
