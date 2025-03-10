
import { useState, useEffect } from 'react';
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

export const useFeaturedBlueprints = () => {
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

  return { featuredBlueprints, loading, fetchFeaturedBlueprints };
};
