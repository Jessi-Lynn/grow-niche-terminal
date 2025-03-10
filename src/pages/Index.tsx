
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedBlueprints from '@/components/home/FeaturedBlueprints';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToAction from '@/components/home/CallToAction';
import { useFeaturedBlueprints } from '@/hooks/useFeaturedBlueprints';

const Index = () => {
  const { featuredBlueprints, loading } = useFeaturedBlueprints();
  
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      <HeroSection />
      <FeaturedBlueprints blueprints={featuredBlueprints} loading={loading} />
      <ServicesSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
