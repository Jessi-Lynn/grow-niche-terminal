
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import ToolCard, { ToolItem } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const tools: ToolItem[] = [
  {
    id: '1',
    name: 'Process Optimization Suite',
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
    affiliateLink: 'https://example.com/affiliate/workflow-analyzer',
  },
  {
    id: '2',
    name: 'Automation Designer Pro',
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
    affiliateLink: 'https://example.com/affiliate/blueprint-generator',
  },
  {
    id: '3',
    name: 'Workflow Timer Essential',
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
    affiliateLink: 'https://example.com/affiliate/process-timer',
  },
];

const Tools = () => {
  const { toast } = useToast();

  const handleCopyAffiliateLink = (link: string, toolName: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: `Affiliate link for ${toolName} copied to clipboard.`,
    });
  };

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              Our <span className="text-terminal-red">Recommended Tools</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              These are the professional tools we use to implement and optimize automation workflows. 
              We've negotiated special deals with our partners that you can access through our affiliate links.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/tools" className="mx-auto">
              These are the tools we trust and use every day in our own automation projects.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-24">
            {tools.map((tool, index) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isReversed={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Need Help Choosing the Right Tools?
            </h2>
            <p className="text-terminal-white/70 max-w-2xl mx-auto">
              Our team has experience with a wide range of automation tools and can help you select the best options for your specific needs.
            </p>
          </div>
          
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-xl font-bold text-terminal-white mb-4">
              Get Personalized Tool Recommendations
            </h3>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              Tell us about your automation goals, and we'll recommend the right combination of tools to help you succeed.
            </p>
            
            <Button asChild className="glow-button">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Tools;
