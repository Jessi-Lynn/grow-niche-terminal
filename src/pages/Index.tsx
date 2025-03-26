
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedBlueprints from '@/components/home/FeaturedBlueprints';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToAction from '@/components/home/CallToAction';
import Terminal from '@/components/Terminal';

const Index = () => {
  const [siteUrl, setSiteUrl] = useState('');
  
  useEffect(() => {
    // Get the current site URL
    setSiteUrl(window.location.origin);
    
    // Also log it to console for easy copy-paste
    console.log("Site URL for sharing:", window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {siteUrl && (
        <div className="container mx-auto px-4 pt-24 pb-4">
          <Terminal title="terminal@growyourniche: ~/url">
            <p className="text-terminal-green mb-2">Your site URL:</p>
            <p className="bg-terminal-black p-2 rounded border border-terminal-white/20 font-mono">
              {siteUrl}
            </p>
            <p className="text-terminal-gray mt-2 text-sm">Share this URL with others to access your site.</p>
          </Terminal>
        </div>
      )}
      
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
