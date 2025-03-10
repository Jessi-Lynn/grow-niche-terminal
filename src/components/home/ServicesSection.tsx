
import React from 'react';
import { Terminal, Database, Bot } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

const ServicesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold text-terminal-white mb-8 text-center">
          Our <span className="text-terminal-red">Services</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="Automation Consulting"
            description="Expert guidance to identify and implement automation opportunities in your business."
            icon={<Terminal size={48} />}
            link="/services"
          />
          
          <ServiceCard
            title="Custom Blueprint Development"
            description="Tailored JSON blueprints designed to meet your specific business requirements."
            icon={<Database size={48} />}
            link="/services"
          />
          
          <ServiceCard
            title="AI-Powered Solutions"
            description="Leverage the power of AI to optimize your business processes and gain a competitive edge."
            icon={<Bot size={48} />}
            link="/services"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
