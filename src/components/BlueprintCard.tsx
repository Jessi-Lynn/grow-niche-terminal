
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileJson, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface BlueprintCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  featured?: boolean;
  onDelete?: () => void;
}

const BlueprintCard = ({
  id,
  title,
  description,
  price,
  category,
  slug,
  featured = false,
  onDelete
}: BlueprintCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blueprint?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('blueprints')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blueprint deleted successfully',
      });
      
      onDelete?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete blueprint',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={cn(
        "blueprint-card group relative",
        featured && "border-terminal-red terminal-shadow",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAdmin && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={16} />
        </Button>
      )}
      
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <FileJson size={20} className="text-terminal-red mr-2" />
            <span className="text-xs text-terminal-white/60 font-mono">{category}</span>
          </div>
          {featured && (
            <span className="bg-terminal-red text-terminal-black text-xs px-2 py-0.5 rounded font-mono">
              Featured
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-2 text-terminal-white group-hover:text-terminal-red transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm text-terminal-white/70 mb-6 flex-grow">
          {description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-terminal-white font-bold">
            ${price.toFixed(2)}
          </span>
          
          <Link 
            to={`/blueprints/${slug}`}
            className="flex items-center text-terminal-red hover:underline text-sm"
          >
            View Details
            <ArrowRight size={16} className={cn(
              "ml-1 transition-transform duration-300",
              isHovered ? "translate-x-1" : ""
            )} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlueprintCard;
