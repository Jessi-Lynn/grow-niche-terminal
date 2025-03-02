
import { useState, useEffect } from 'react';
import { Search, Filter, FileJson } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import BlueprintCard from '@/components/BlueprintCard';
import { supabase } from '@/lib/supabase';
import { Blueprint } from '@/hooks/use-blueprint';
import { toast } from '@/components/ui/use-toast';

const categories = ['All', 'E-commerce', 'Marketing', 'Data', 'Customer Service', 'Content', 'HR'];

const Blueprints = () => {
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
  
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              JSON <span className="text-terminal-red">Blueprints</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              Discover our collection of premium JSON blueprints to automate and scale your business operations.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/blueprints" className="mx-auto">
              Explore our library of automation blueprints. Each blueprint is thoroughly tested and ready for implementation.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel p-6 rounded-md mb-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-white/50" />
                  <input
                    type="text"
                    placeholder="Search blueprints..."
                    className="w-full bg-terminal-black border border-terminal-gray rounded-md py-2 pl-10 pr-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-terminal-white/50" />
                <span className="text-sm text-terminal-white/70">Filter:</span>
                <select
                  className="bg-terminal-black border border-terminal-gray rounded-md py-2 px-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-terminal-gray/10 border border-terminal-gray/20 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-terminal-gray/20 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-terminal-gray/20 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-terminal-gray/20 rounded w-full mb-2"></div>
                  <div className="h-4 bg-terminal-gray/20 rounded w-5/6 mb-6"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-5 bg-terminal-gray/20 rounded w-1/5"></div>
                    <div className="h-5 bg-terminal-gray/20 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlueprints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlueprints.map(blueprint => (
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
          ) : (
            <div className="text-center py-12">
              <FileJson size={48} className="text-terminal-red mx-auto mb-4" />
              <h3 className="text-xl font-bold text-terminal-white mb-2">No Blueprints Found</h3>
              <p className="text-terminal-white/70">
                We couldn't find any blueprints matching your search criteria. Please try a different search term or category.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-terminal-gray/10 border border-terminal-gray rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-terminal-white mb-4">
              Don't See What You Need?
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-6">
              We can create custom blueprints tailored to your specific business requirements and workflows.
            </p>
            
            <a href="/contact" className="glow-button">
              Request Custom Blueprint
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blueprints;
