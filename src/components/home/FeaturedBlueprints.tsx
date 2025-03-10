
import React from 'react';
import { Link } from 'react-router-dom';
import BlueprintCard from '@/components/BlueprintCard';

interface Blueprint {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  featured: boolean;
}

interface FeaturedBlueprintsProps {
  blueprints: Blueprint[];
  loading: boolean;
}

const FeaturedBlueprints = ({ blueprints, loading }: FeaturedBlueprintsProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-terminal-white mb-4 md:mb-0">
            Featured <span className="text-terminal-red">Blueprints</span>
          </h2>
          
          <Link
            to="/blueprints"
            className="glow-button"
          >
            View All Blueprints
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading placeholder
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="blueprint-card animate-pulse">
                <div className="h-64 bg-terminal-gray/20"></div>
              </div>
            ))
          ) : (
            blueprints.map(blueprint => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlueprints;
