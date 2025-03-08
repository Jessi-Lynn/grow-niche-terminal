
import BlueprintCard from '@/components/BlueprintCard';
import BlueprintsLoading from './BlueprintsLoading';
import BlueprintsEmptyState from './BlueprintsEmptyState';
import { Blueprint } from '@/hooks/use-blueprint';

interface BlueprintsListProps {
  blueprints: Blueprint[];
  isLoading: boolean;
}

const BlueprintsList = ({ blueprints, isLoading }: BlueprintsListProps) => {
  if (isLoading) {
    return <BlueprintsLoading />;
  }

  if (blueprints.length === 0) {
    return <BlueprintsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blueprints.map(blueprint => (
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
  );
};

export default BlueprintsList;
