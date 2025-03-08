
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import BlueprintsSearch from '@/components/blueprints/BlueprintsSearch';
import BlueprintsFilter from '@/components/blueprints/BlueprintsFilter';
import BlueprintsList from '@/components/blueprints/BlueprintsList';
import BlueprintsCTA from '@/components/blueprints/BlueprintsCTA';
import { useBlueprints } from '@/hooks/use-blueprints';

const categories = ['All', 'E-commerce', 'Marketing', 'Data', 'Customer Service', 'Content', 'HR'];

const Blueprints = () => {
  const { 
    blueprints, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory 
  } = useBlueprints();
  
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
              <BlueprintsSearch 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
              />
              
              <BlueprintsFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
              />
            </div>
          </div>
          
          <BlueprintsList 
            blueprints={blueprints} 
            isLoading={isLoading} 
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <BlueprintsCTA />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blueprints;
