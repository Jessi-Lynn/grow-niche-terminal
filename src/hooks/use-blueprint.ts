
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  featured?: boolean;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
  version?: string;
  details?: string;
  requirements?: string[];
}

export function useBlueprint(slug: string) {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlueprint() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blueprints')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError('Blueprint not found');
          return;
        }
        
        setBlueprint(data);
      } catch (err) {
        console.error('Error fetching blueprint:', err);
        setError('Failed to load blueprint details');
        toast({
          title: 'Error',
          description: 'Failed to load blueprint details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlueprint();
  }, [slug]);

  const handleDownload = async () => {
    if (!blueprint) return;
    
    try {
      toast({
        title: 'Processing download',
        description: 'Preparing your blueprint file...',
      });
      
      const { data, error } = await supabase.storage
        .from('blueprints')
        .download(blueprint.file_path || '');
      
      if (error) throw error;
      
      // Create a download link with the file blob
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = blueprint.file_path?.split('/').pop() || `${blueprint.slug}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download complete',
        description: 'Your blueprint has been downloaded successfully!',
      });
      
      return true;
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: 'Download failed',
        description: 'There was an error downloading your blueprint',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { blueprint, isLoading, error, handleDownload };
}
