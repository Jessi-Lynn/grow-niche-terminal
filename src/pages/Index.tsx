import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Database, Bot } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TypingEffect from '@/components/TypingEffect';
import BlueprintCard from '@/components/BlueprintCard';
import ServiceCard from '@/components/ServiceCard';
import TerminalComponent from '@/components/Terminal';
import { supabase } from '@/lib/supabase';

interface Blueprint {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  featured: boolean;
}

const Index = () => {
  const [featuredBlueprints, setFeaturedBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFeaturedBlueprints();
  }, []);

  const fetchFeaturedBlueprints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('featured', true);
        
      if (error) throw error;
      
      setFeaturedBlueprints(data || []);
    } catch (error) {
      console.error('Error fetching featured blueprints:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-terminal-white">
                Automate Your Business with JSON <span className="text-terminal-red">Blueprints</span>
              </h1>
              
              <p className="text-terminal-white/70 mb-8">
                Unlock the power of automation with our curated collection of JSON blueprints. Streamline your workflows, save time, and scale your business effortlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/blueprints"
                  className="glow-button"
                >
                  Explore Blueprints
                </Link>
                
                <Link
                  to="/contact"
                  className="text-terminal-white hover:text-terminal-red transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div>
              <TerminalComponent title="terminal@growyourniche: ~">
                <TypingEffect text="npm install @growyourniche/automation" speed={50} delay={500} cursor />
              </TerminalComponent>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Blueprints */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-terminal-white mb-4 md:mb-0">
              Featured <span className="text-terminal-red">Blueprints</span>
            </h2>
            
            <Link
              to="/blueprints"
              className="glow-button"
            >
              View All Blueprints
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlueprints.map(blueprint => (
              <BlueprintCard
                key={blueprint.id} // Use blueprint.id as the key, but don't pass it as a prop
                id={blueprint.id}
                title={blueprint.title}
                description={blueprint.description}
                price={blueprint.price}
                category={blueprint.category}
                slug={blueprint.slug}
                featured={blueprint.featured}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Services */}
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
      
      {/* Features */}
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
            
            <div>
              <TerminalComponent title="terminal@growyourniche: ~/features">
                <TypingEffect text="git clone https://github.com/growyourniche/blueprints.git" speed={50} delay={500} cursor />
              </TerminalComponent>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
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
      
      <Footer />
    </div>
  );
};

export default Index;
