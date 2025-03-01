
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileJson, Code, Zap } from 'lucide-react';
import Terminal from '@/components/Terminal';
import TypingEffect from '@/components/TypingEffect';
import BlueprintCard from '@/components/BlueprintCard';
import ServiceCard from '@/components/ServiceCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const featuredBlueprints = [
  {
    id: '1',
    title: 'E-commerce Automation Blueprint',
    description: 'Comprehensive JSON blueprint for automating product listing, inventory management, and order processing.',
    price: 49.99,
    category: 'E-commerce',
    slug: 'ecommerce-automation',
    featured: true
  },
  {
    id: '2',
    title: 'Social Media Content Pipeline',
    description: 'Streamline your social media workflow with this advanced content scheduling and posting blueprint.',
    price: 39.99,
    category: 'Marketing',
    slug: 'social-media-content-pipeline'
  },
  {
    id: '3',
    title: 'Data Scraping & Analytics Framework',
    description: 'Extract, transform, and analyze data from multiple sources with this powerful automation blueprint.',
    price: 59.99,
    category: 'Data',
    slug: 'data-scraping-analytics-framework'
  }
];

const Index = () => {
  const [showTerminalContent, setShowTerminalContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTerminalContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#ea384c10,transparent_70%)]"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-terminal-white">
              <span className="text-terminal-red">Automate</span> Your Growth
            </h1>
            
            <p className="text-xl text-terminal-white/70 max-w-2xl mb-8">
              Premium JSON blueprints and custom automation services to scale your business operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/blueprints" className="glow-button">
                Explore Blueprints
              </Link>
              <Link to="/services" className="border border-terminal-white text-terminal-white px-6 py-2 rounded font-mono font-bold transition-all duration-300 hover:bg-terminal-white hover:text-terminal-black">
                Our Services
              </Link>
            </div>
          </div>
          
          <div className="mt-12 animate-fadeIn opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <Terminal fullWidth title="terminal@growyourniche: ~/automate" autoType>
              {`Welcome to GrowYourNiche - Your automation journey begins here.\nLet's build something great together.`}
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Featured Blueprints */}
      <section className="py-20 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white">
              <span className="text-terminal-red">Featured</span> Blueprints
            </h2>
            <Link to="/blueprints" className="flex items-center text-terminal-white hover:text-terminal-red transition-colors duration-300">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlueprints.map(blueprint => (
              <BlueprintCard
                key={blueprint.id}
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
      
      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Our <span className="text-terminal-red">Services</span>
            </h2>
            <p className="text-terminal-white/70 max-w-2xl mx-auto">
              We don't just provide blueprints - we help you implement custom automation solutions tailored to your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              title="Custom Blueprint Development"
              description="Tailor-made JSON blueprints designed specifically for your business workflows and integration requirements."
              icon={<FileJson size={32} />}
              link="/services#custom-blueprints"
            />
            
            <ServiceCard
              title="Implementation & Integration"
              description="Expert assistance in implementing blueprints and integrating them with your existing systems and tools."
              icon={<Code size={32} />}
              link="/services#implementation"
            />
            
            <ServiceCard
              title="Automation Consulting"
              description="Strategic guidance on identifying and prioritizing automation opportunities to maximize ROI."
              icon={<Zap size={32} />}
              link="/services#consulting"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services" className="glow-button">
              Explore All Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-terminal-red/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,#ea384c10,transparent_70%)]"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="glass-panel rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Ready to <span className="text-terminal-red">Supercharge</span> Your Workflow?
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              Whether you need a pre-built blueprint or a custom automation solution, we've got you covered. Let's transform your business operations together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blueprints" className="glow-button">
                Browse Blueprints
              </Link>
              <Link to="/contact" className="border border-terminal-white text-terminal-white px-6 py-2 rounded font-mono font-bold transition-all duration-300 hover:bg-terminal-white hover:text-terminal-black">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
