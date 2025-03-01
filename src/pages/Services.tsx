
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { FileJson, Code, Zap, PenTool, Briefcase, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesData = [
  {
    id: 'custom-blueprints',
    icon: <FileJson size={48} className="text-terminal-red" />,
    title: 'Custom Blueprint Development',
    description: 'Tailor-made JSON blueprints designed specifically for your business workflows and integration requirements.',
    features: [
      'Comprehensive workflow analysis',
      'Custom blueprint architecture design',
      'Integration with existing systems',
      'Thorough documentation',
      'Implementation support'
    ]
  },
  {
    id: 'implementation',
    icon: <Code size={48} className="text-terminal-red" />,
    title: 'Implementation & Integration',
    description: 'Expert assistance in implementing blueprints and integrating them with your existing systems and tools.',
    features: [
      'Blueprint deployment',
      'System integration',
      'Testing and validation',
      'Performance optimization',
      'Staff training'
    ]
  },
  {
    id: 'consulting',
    icon: <Zap size={48} className="text-terminal-red" />,
    title: 'Automation Consulting',
    description: 'Strategic guidance on identifying and prioritizing automation opportunities to maximize ROI.',
    features: [
      'Process audit and analysis',
      'Automation opportunity mapping',
      'ROI projection',
      'Implementation roadmap',
      'Ongoing support and optimization'
    ]
  }
];

const additionalServices = [
  {
    icon: <PenTool size={24} />,
    title: 'Custom Development',
    description: 'Bespoke development solutions beyond blueprint implementation.'
  },
  {
    icon: <Briefcase size={24} />,
    title: 'Business Process Optimization',
    description: 'Refine your processes before automation for maximum efficiency.'
  },
  {
    icon: <Settings size={24} />,
    title: 'Maintenance & Support',
    description: 'Ongoing support and maintenance to ensure your automated systems run smoothly.'
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              Our <span className="text-terminal-red">Services</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              We provide expert services to help you implement, customize, and optimize your automation workflows.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/services" className="mx-auto">
              Beyond blueprints, we offer comprehensive services to ensure your automation journey is successful from start to finish.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Main Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-24">
            {servicesData.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="md:w-1/2">
                  <div className="glass-panel p-8 rounded-md inline-block mb-6">
                    {service.icon}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-terminal-white/70 mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle size={18} className="text-terminal-red mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-terminal-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/contact" className="glow-button mt-8 inline-block">
                    Get Started
                  </Link>
                </div>
                
                <div className="md:w-1/2">
                  <div className="terminal-window w-full">
                    <div className="terminal-header">
                      <div className="terminal-header-dot bg-red-500"></div>
                      <div className="terminal-header-dot bg-yellow-500"></div>
                      <div className="terminal-header-dot bg-green-500"></div>
                      <div className="ml-2 text-xs text-terminal-white opacity-80">
                        terminal@growyourniche: ~/{service.id}
                      </div>
                    </div>
                    <div className="terminal-content p-6">
                      <div>
                        <span className="text-terminal-red">$</span> {index === 0 && 'generate_blueprint --custom --client="YourCompany"'}
                        {index === 1 && 'implement_blueprint --blueprint="custom_workflow.json" --integrate'}
                        {index === 2 && 'analyze_processes --identify-opportunities --calculate-roi'}
                      </div>
                      <div className="mt-4 text-terminal-white/70 text-sm font-mono">
                        {index === 0 && (
                          <>
                            <div># Analyzing client requirements...</div>
                            <div># Mapping business processes...</div>
                            <div># Designing custom blueprint architecture...</div>
                            <div># Generating integration points...</div>
                            <div className="text-terminal-white mt-4">✓ Custom blueprint successfully generated and ready for implementation.</div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div># Loading blueprint configuration...</div>
                            <div># Verifying system compatibility...</div>
                            <div># Establishing integration connections...</div>
                            <div># Testing data flow and processes...</div>
                            <div className="text-terminal-white mt-4">✓ Blueprint successfully implemented and integrated with existing systems.</div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div># Scanning business processes...</div>
                            <div># Identifying automation opportunities...</div>
                            <div># Calculating potential ROI...</div>
                            <div># Generating implementation roadmap...</div>
                            <div className="text-terminal-white mt-4">✓ Analysis complete. Found 12 high-impact automation opportunities with estimated 267% ROI.</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional Services */}
      <section className="py-16 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-12 text-center">
            Additional <span className="text-terminal-red">Services</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="glass-panel p-6 rounded-md">
                <div className="text-terminal-red mb-4">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-terminal-white mb-2">
                  {service.title}
                </h3>
                
                <p className="text-terminal-white/70 mb-4">
                  {service.description}
                </p>
                
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-terminal-red hover:underline text-sm"
                >
                  Learn more
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Ready to Transform Your Workflow?
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              Contact us today to discuss your automation needs and discover how our services can help your business grow.
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

export default Services;
