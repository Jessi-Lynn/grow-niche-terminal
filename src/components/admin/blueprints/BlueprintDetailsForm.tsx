
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BlueprintFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  details?: string;
  featured: boolean;
}

interface BlueprintDetailsFormProps {
  formData: BlueprintFormData;
  categories: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BlueprintDetailsForm = ({ formData, categories, onInputChange }: BlueprintDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-terminal-white mb-4">Blueprint Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-terminal-white">
            Title *
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="E.g. E-commerce Automation Blueprint"
            value={formData.title}
            onChange={onInputChange}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price" className="text-terminal-white">
            Price ($) *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="49.99"
            value={formData.price}
            onChange={onInputChange}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-terminal-white">
            Category *
          </Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onInputChange}
            className="w-full rounded-md border border-terminal-white/20 bg-terminal-black px-3 py-2 text-terminal-white"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-terminal-white">
            Slug * (URL-friendly identifier)
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="ecommerce-automation"
            value={formData.slug}
            onChange={onInputChange}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-terminal-white">
            Short Description * (1-2 sentences)
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="A brief overview of what this blueprint does"
            value={formData.description}
            onChange={onInputChange}
            rows={2}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="details" className="text-terminal-white">
            Detailed Description (optional)
          </Label>
          <Textarea
            id="details"
            name="details"
            placeholder="Provide more detailed information about the blueprint"
            value={formData.details || ''}
            onChange={onInputChange}
            rows={4}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => onInputChange(e)}
              className="h-4 w-4 text-terminal-red"
            />
            <Label htmlFor="featured" className="text-terminal-white">
              Featured Blueprint (appears highlighted)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDetailsForm;
