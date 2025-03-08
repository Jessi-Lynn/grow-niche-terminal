import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSuabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, Plus, Save, Trash, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';

interface BlueprintFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  details?: string;
  featured: boolean;
  requirements: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<BlueprintFormData>({
    title: '',
    description: '',
    price: 0,
    category: 'E-commerce',
    slug: '',
    details: '',
    featured: false,
    requirements: [''],
  });

  const categories = [
    'E-commerce', 
    'Marketing', 
    'Data', 
    'Customer Service', 
    'Content', 
    'HR'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'title' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData({ ...formData, slug });
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  const addRequirement = () => {
    setFormData({ 
      ...formData, 
      requirements: [...formData.requirements, ''] 
    });
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'price', 'category', 'slug'];
    for (const field of requiredFields) {
      if (!formData[field as keyof BlueprintFormData]) {
        toast({
          title: 'Validation Error',
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: 'destructive',
        });
        return false;
      }
    }

    if (!file) {
      toast({
        title: 'Validation Error',
        description: 'Please upload a blueprint file',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setUploading(true);
      
      const fileExt = file!.name.split('.').pop();
      const filePath = `blueprints/${formData.slug}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blueprints')
        .upload(filePath, file!, {
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data: blueprint, error: insertError } = await supabase
        .from('blueprints')
        .insert({
          ...formData,
          file_path: filePath,
          requirements: formData.requirements.filter(req => req.trim() !== '')
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      toast({
        title: 'Success!',
        description: 'Blueprint was successfully added',
      });
      
      navigate(`/blueprints/${blueprint.slug}`);
      
    } catch (error) {
      console.error('Error uploading blueprint:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your blueprint',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
            <span className="text-terminal-red">Admin</span> Dashboard
          </h1>
          
          <Terminal title="terminal@growyourniche: ~/admin" className="mx-auto mb-8">
            {isSuabaseConfigured 
              ? "Upload and manage your JSON blueprints. All fields marked with * are required."
              : "⚠️ Supabase configuration is missing. Please add the required environment variables to enable blueprint upload functionality."}
          </Terminal>
          
          {!isSuabaseConfigured && (
            <div className="glass-panel p-6 rounded-md text-center mb-6">
              <AlertTriangle size={48} className="text-terminal-red mx-auto mb-4" />
              <h2 className="text-xl font-bold text-terminal-white mb-2">Supabase Configuration Missing</h2>
              <p className="text-terminal-white/70 mb-4">
                To use the admin dashboard, you need to configure the following environment variables in your Netlify deployment:
              </p>
              <div className="bg-terminal-black/60 p-4 rounded-md text-left mb-4 font-mono text-sm">
                <p className="text-terminal-white mb-2">VITE_SUPABASE_URL=your_supabase_url</p>
                <p className="text-terminal-white">VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</p>
              </div>
              <p className="text-terminal-white/70 text-sm">
                You can find these values in your Supabase project dashboard.
              </p>
            </div>
          )}
          
          {isSuabaseConfigured && (
            <div className="glass-panel p-6 rounded-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-terminal-white mb-4">Blueprint File</h2>
                  <div className="border-2 border-dashed border-terminal-red/30 rounded-md p-6 text-center">
                    <label className="cursor-pointer block w-full">
                      <input 
                        type="file" 
                        accept=".json"
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      
                      {!file ? (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-12 w-12 text-terminal-red" />
                          <p className="text-terminal-white">
                            Drag & drop your JSON file here or <span className="text-terminal-red underline">browse</span>
                          </p>
                          <p className="text-sm text-terminal-white/60">
                            Accepts .json files only
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-terminal-white">
                            <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
                          </p>
                          <p className="text-sm text-terminal-red underline cursor-pointer">
                            Change file
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                <Separator className="bg-terminal-white/10" />
                
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                          className="h-4 w-4 text-terminal-red"
                        />
                        <Label htmlFor="featured" className="text-terminal-white">
                          Featured Blueprint (appears highlighted)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-terminal-white/10" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-terminal-white mb-4">Requirements (Optional)</h2>
                  
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="E.g. API key access"
                        className="flex-1 bg-terminal-black border-terminal-white/20 text-terminal-white"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeRequirement(index)}
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
                    onClick={addRequirement}
                    className="mt-2 border-terminal-red/50 text-terminal-red hover:text-terminal-white hover:bg-terminal-red/20"
                  >
                    <Plus size={16} className="mr-2" /> Add Requirement
                  </Button>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full bg-terminal-red hover:bg-terminal-red/80 text-terminal-black"
                  >
                    {uploading ? 'Uploading...' : (
                      <>
                        <Save size={16} className="mr-2" /> Save Blueprint
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Admin;
