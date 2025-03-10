
import { Check, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
  linkUrl: string;
  isFree: boolean;
  affiliateLink?: string;
}

interface ToolCardProps {
  tool: ToolItem;
  isReversed?: boolean;
}

const ToolCard = ({ tool, isReversed = false }: ToolCardProps) => {
  return (
    <div 
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
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
          <Wrench size={32} className="text-terminal-red" />
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
          <Button 
            asChild
            variant="default"
            className="glow-button"
          >
            <a 
              href={tool.affiliateLink || tool.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {tool.isFree ? (
                <>
                  <Download size={18} />
                  Download Free
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  Get This Tool
                </>
              )}
            </a>
          </Button>
          
          {!tool.isFree && (
            <Button
              asChild
              variant="outline"
              className="border-terminal-gray text-terminal-white hover:bg-terminal-gray/20"
            >
              <Link to="/contact">
                Request Demo
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
