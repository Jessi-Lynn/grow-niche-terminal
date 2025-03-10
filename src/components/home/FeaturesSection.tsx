
import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-terminal-white mb-6">
              Key <span className="text-terminal-red">Features</span>
            </h2>
            
            <ul className="list-disc pl-5 text-terminal-white/70 space-y-2">
              <li>Pre-built JSON blueprints for various business processes</li>
              <li>Customizable templates to fit your unique needs</li>
              <li>Step-by-step guides and documentation</li>
              <li>Dedicated support and community forum</li>
              <li>Regular updates and new blueprint releases</li>
            </ul>
          </div>
          
          <div className="bg-terminal-black/50 p-6 rounded-lg border border-terminal-gray/20">
            <h3 className="text-xl font-semibold text-terminal-white mb-4">Why Choose Our Blueprints?</h3>
            <p className="text-terminal-white/70 mb-4">
              Our JSON blueprints are designed by industry experts with years of experience in business automation.
              Each blueprint is thoroughly tested and optimized for maximum efficiency and ease of use.
            </p>
            <p className="text-terminal-white/70">
              Start automating your business processes today and focus on what truly matters - growing your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
