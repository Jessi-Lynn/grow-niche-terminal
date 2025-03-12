
import BlueprintCard from '@/components/BlueprintCard';
import { useFeaturedBlueprints } from '@/hooks/useFeaturedBlueprints';

const FeaturedBlueprints = () => {
  const { featuredBlueprints, loading, fetchFeaturedBlueprints } = useFeaturedBlueprints();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBlueprints.map((blueprint) => (
        <BlueprintCard
          key={blueprint.id}
          {...blueprint}
          onDelete={fetchFeaturedBlueprints}
        />
      ))}
    </div>
  );
};

export default FeaturedBlueprints;
