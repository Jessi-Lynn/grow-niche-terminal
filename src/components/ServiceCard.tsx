
import { Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  link,
  className
}: ServiceCardProps) => {
  return (
    <div className={cn(
      "glass-panel rounded-md p-6 transition-all duration-300 hover:terminal-shadow",
      className
    )}>
      <div className="text-terminal-red mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-bold mb-2 text-terminal-white">
        {title}
      </h3>
      
      <p className="text-sm text-terminal-white/70 mb-4">
        {description}
      </p>
      
      <Link 
        to={link}
        className="inline-flex items-center text-terminal-red hover:underline text-sm mt-auto"
      >
        Learn more
        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
};

export default ServiceCard;
