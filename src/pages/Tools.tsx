
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { Tool, Download, ExternalLink, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
  linkUrl: string;
  isFree: boolean;
}

const tools: ToolItem[] = [
  {
    id: '1',
    name: 'Workflow Analyzer',
    description: 'A powerful tool for analyzing your existing workflows and identifying automation opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    features: [
      'Process mapping visualization',
      'Efficiency metrics calculation',
      'Automation opportunity identification',
      'ROI calculator',
      'Integration points analysis'
    ],
    linkUrl: 'https://example.com/workflow-analyzer',
    isFree: false,
  },
  {
    id: '2',
    name: 'Blueprint Generator',
    description: 'Create custom automation blueprints with our easy-to-use blueprint generator.',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    features: [
      'Drag-and-drop interface',
      'Pre-built workflow templates',
      'Custom integration configurations',
      'JSON schema validation',
      'One-click export'
    ],
    linkUrl: 'https://example.com/blueprint-generator',
    isFree: false,
  },
  {
    id: '3',
    name: 'Process Timer',
    description: 'A simple but effective tool for timing your business processes to identify bottlenecks.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    features: [
      'Multi-stage process timing',
      'Comparative analytics',
      'Historical tracking',
      'Team performance metrics',
      'Exportable reports'
    ],
    linkUrl: 'https://example.com/process-timer',
    isFree: true,
  },
];

const Tools = () => {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              Our <span className="text-terminal-red">Tools</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              Discover our suite of specialized tools designed to help you implement and optimize your automation workflows.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/tools" className="mx-auto">
              Supercharge your productivity with our professional-grade automation tools and utilities.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-24">
            {tools.map((tool, index) => (
              <div 
                key={tool.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="md:w-1/2">
                  <div className="relative">
                    <img 
                      src={tool.imageUrl} 
                      alt={tool.name}
                      className="rounded-lg object-cover w-full shadow-lg h-64 md:h-80"
                    />
                    {tool.isFree && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Free
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className="glass-panel p-8 rounded-md inline-block mb-6">
                    <Tool size={32} className="text-terminal-red" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
                    {tool.name}
                  </h2>
                  
                  <p className="text-terminal-white/70 mb-6">
                    {tool.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold text-terminal-white mb-3">Key Features:</h3>
                  
                  <ul className="space-y-2 mb-8">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={18} className="text-terminal-red mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-terminal-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={tool.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glow-button inline-flex items-center"
                    >
                      {tool.isFree ? (
                        <>
                          <Download size={18} className="mr-2" />
                          Download Free
                        </>
                      ) : (
                        <>
                          <ExternalLink size={18} className="mr-2" />
                          Learn More
                        </>
                      )}
                    </a>
                    
                    {!tool.isFree && (
                      <Link to="/contact" className="border border-terminal-gray text-terminal-white px-6 py-2 rounded font-mono transition-all duration-300 hover:bg-terminal-gray/20">
                        Request Demo
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Need a Custom Tool?
            </h2>
            <p className="text-terminal-white/70 max-w-2xl mx-auto">
              We can develop specialized tools tailored to your specific business requirements.
            </p>
          </div>
          
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-xl font-bold text-terminal-white mb-4">
              Let's Discuss Your Requirements
            </h3>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              Contact our team to discuss how we can develop custom tools to address your unique automation challenges.
            </p>
            
            <Link to="/contact" className="glow-button">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Tools;
