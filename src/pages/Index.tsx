
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedBlueprints from '@/components/home/FeaturedBlueprints';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      <HeroSection />
      <FeaturedBlueprints />
      <ServicesSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
