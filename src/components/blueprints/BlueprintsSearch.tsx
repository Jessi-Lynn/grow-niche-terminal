
import { Search } from 'lucide-react';

interface BlueprintsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BlueprintsSearch = ({ searchTerm, setSearchTerm }: BlueprintsSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-white/50" />
      <input
        type="text"
        placeholder="Search blueprints..."
        className="w-full bg-terminal-black border border-terminal-gray rounded-md py-2 pl-10 pr-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default BlueprintsSearch;
