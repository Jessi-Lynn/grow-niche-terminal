
import React from 'react';
import { Link } from 'react-router-dom';
import TerminalComponent from '@/components/Terminal';
import TypingEffect from '@/components/TypingEffect';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-terminal-white">
            Supercharge Your Business with Seamless Workflow <span className="text-terminal-red">Automation Blueprints</span>
          </h1>
          
          <p className="text-terminal-white/70 mb-8 max-w-2xl mx-auto">
            Unlock the power of automation with our curated collection of JSON blueprints. Streamline your workflows, save time, and scale your business effortlessly.
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/blueprints"
              className="glow-button"
            >
              Explore Blueprints
            </Link>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <TerminalComponent title="terminal@growyourniche: ~">
            <TypingEffect text="Welcome to GrowYourNiche - Let's build together." speed={50} delay={500} cursor />
          </TerminalComponent>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
