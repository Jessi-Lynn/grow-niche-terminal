
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-terminal-white mb-8">
          Ready to <span className="text-terminal-red">Automate</span> Your Business?
        </h2>
        
        <p className="text-terminal-white/70 mb-12">
          Join our community of forward-thinking entrepreneurs and start automating your business processes today.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/blueprints"
            className="glow-button"
          >
            Browse Blueprints
          </Link>
          
          <Link
            to="/contact"
            className="text-terminal-white hover:text-terminal-red transition-colors duration-300"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
