
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagsInput = ({ tags, onChange }: TagsInputProps) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    if (!tags.includes(tagInput.trim())) {
      onChange([...tags, tagInput.trim()]);
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="tags" className="text-terminal-white">
        Tags
      </Label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index}
            className="flex items-center gap-1 bg-terminal-gray/30 text-terminal-white/80 px-2 py-1 rounded"
          >
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-terminal-white/60 hover:text-terminal-red"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          id="tagInput"
          placeholder="Add a tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          className="flex-1 bg-terminal-black border-terminal-white/20 text-terminal-white"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          variant="outline"
          className="border-terminal-red/50 text-terminal-red hover:text-terminal-white hover:bg-terminal-red/20"
        >
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default TagsInput;
