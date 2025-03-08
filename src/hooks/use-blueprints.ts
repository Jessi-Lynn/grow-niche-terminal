
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Blueprint } from '@/hooks/use-blueprint';
import { toast } from '@/components/ui/use-toast';

export const useBlueprints = () => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    async function fetchBlueprints() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blueprints')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        setBlueprints(data || []);
      } catch (err) {
        console.error('Error fetching blueprints:', err);
        toast({
          title: 'Error',
          description: 'Failed to load blueprints',
          variant: 'destructive',
        });
        // Fall back to dummy data if fetch fails
        const dummyBlueprints = [
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
          },
          {
            id: '4',
            title: 'Customer Support Automation',
            description: 'Enhance customer experience with intelligent ticket routing, auto-responses, and support workflow management.',
            price: 44.99,
            category: 'Customer Service',
            slug: 'customer-support-automation'
          },
          {
            id: '5',
            title: 'Content Management System',
            description: 'A complete blueprint for managing, scheduling, and distributing content across multiple platforms.',
            price: 54.99,
            category: 'Content',
            slug: 'content-management-system'
          },
          {
            id: '6',
            title: 'HR Process Automation',
            description: 'Streamline onboarding, time tracking, leave management, and performance reviews.',
            price: 49.99,
            category: 'HR',
            slug: 'hr-process-automation'
          }
        ];
        setBlueprints(dummyBlueprints);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlueprints();
  }, []);
  
  // Filter blueprints based on search term and category
  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesSearch = blueprint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blueprint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blueprint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
    blueprints: filteredBlueprints,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory
  };
};
