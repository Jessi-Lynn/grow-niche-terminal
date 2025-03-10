
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus } from 'lucide-react';

interface RequirementsListProps {
  requirements: string[];
  onRequirementChange: (index: number, value: string) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (index: number) => void;
}

const RequirementsList = ({
  requirements,
  onRequirementChange,
  onAddRequirement,
  onRemoveRequirement,
}: RequirementsListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-terminal-white mb-4">Requirements (Optional)</h2>
      
      {requirements.map((requirement, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={requirement}
            onChange={(e) => onRequirementChange(index, e.target.value)}
            placeholder="E.g. API key access"
            className="flex-1 bg-terminal-black border-terminal-white/20 text-terminal-white"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={() => onRemoveRequirement(index)}
            className="border-terminal-red/50 text-terminal-red hover:text-terminal-white hover:bg-terminal-red/20"
          >
            <Trash size={16} />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddRequirement}
        className="mt-2 border-terminal-red/50 text-terminal-red hover:text-terminal-white hover:bg-terminal-red/20"
      >
        <Plus size={16} className="mr-2" /> Add Requirement
      </Button>
    </div>
  );
};

export default RequirementsList;
