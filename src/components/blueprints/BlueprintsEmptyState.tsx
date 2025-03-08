
import { FileJson } from 'lucide-react';

const BlueprintsEmptyState = () => {
  return (
    <div className="text-center py-12">
      <FileJson size={48} className="text-terminal-red mx-auto mb-4" />
      <h3 className="text-xl font-bold text-terminal-white mb-2">No Blueprints Found</h3>
      <p className="text-terminal-white/70">
        We couldn't find any blueprints matching your search criteria. Please try a different search term or category.
      </p>
    </div>
  );
};

export default BlueprintsEmptyState;
