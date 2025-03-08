
import { Filter } from 'lucide-react';

interface BlueprintsFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const BlueprintsFilter = ({ categories, selectedCategory, setSelectedCategory }: BlueprintsFilterProps) => {
  return (
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
  );
};

export default BlueprintsFilter;
