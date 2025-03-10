
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import ImageUpload from './ImageUpload';
import MainForm from './MainForm';
import SeoSection from './SeoSection';
import TagsInput from './TagsInput';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  slug: string;
  date: string;
  read_time: string;
  featured: boolean;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  image?: string;
}

interface BlogPostFormProps {
  post: BlogPost;
  onSaved: () => void;
  onCancel: () => void;
}

const BlogPostForm = ({ post, onSaved, onCancel }: BlogPostFormProps) => {
  const [formData, setFormData] = useState<BlogPost>(post);
  const [saving, setSaving] = useState(false);
  const isNewPost = !post.id;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

    // Auto-generate slug from title for new posts
    if (field === 'title' && !formData.slug && isNewPost) {
      const slug = (value as string).toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Auto-populate meta fields for new posts
    if (field === 'title' && isNewPost && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: value as string }));
    }
    
    if (field === 'excerpt' && isNewPost && !formData.meta_description) {
      setFormData(prev => ({ ...prev, meta_description: value as string }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'excerpt', 'content', 'author', 'slug'];
    for (const field of requiredFields) {
      if (!formData[field as keyof BlogPost]) {
        toast({
          title: 'Validation Error',
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      console.log('Starting blog post save...');
      
      const postData = {
        ...formData,
        date: formData.date || new Date().toISOString(),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      console.log('Saving blog post data:', postData);
      
      let result;
      
      if (isNewPost) {
        result = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();
      } else {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', formData.id)
          .select()
          .single();
      }
      
      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      console.log('Blog post saved successfully:', result.data);
      
      toast({
        title: 'Success!',
        description: `Blog post ${isNewPost ? 'created' : 'updated'} successfully`,
      });
      
      onSaved();
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isNewPost ? 'create' : 'update'} blog post. Please check console for details.`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-md">
      <div className="flex items-center mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-terminal-white hover:text-terminal-red mr-2"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-terminal-white">
          {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-terminal-white">Main Article Image</h2>
          <div className="border-2 border-dashed border-terminal-red/30 rounded-md p-6">
            <ImageUpload
              imageUrl={formData.image}
              onImageUploaded={(url) => setFormData({ ...formData, image: url })}
              onImageRemoved={() => setFormData({ ...formData, image: undefined })}
              type="main"
              slug={formData.slug || 'post'}
            />
          </div>
        </div>
        
        <Separator className="bg-terminal-white/10" />
        
        <MainForm
          title={formData.title}
          slug={formData.slug}
          author={formData.author}
          readTime={formData.read_time}
          excerpt={formData.excerpt}
          content={formData.content}
          featured={formData.featured}
          onChange={handleInputChange}
        />
        
        <Separator className="bg-terminal-white/10" />
        
        <SeoSection 
          metaTitle={formData.meta_title || ''}
          metaDescription={formData.meta_description || ''}
          metaKeywords={formData.meta_keywords || ''}
          ogImage={formData.og_image}
          slug={formData.slug || 'post'}
          onMetaChange={handleInputChange}
          onOgImageUploaded={(url) => setFormData({ ...formData, og_image: url })}
          onOgImageRemoved={() => setFormData({ ...formData, og_image: undefined })}
        />
        
        <Separator className="bg-terminal-white/10" />
        
        <TagsInput 
          tags={formData.tags} 
          onChange={(tags) => setFormData({ ...formData, tags })} 
        />
        
        <div className="pt-4 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-terminal-white/20 text-terminal-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-terminal-red hover:bg-terminal-red/80 text-terminal-black"
          >
            {saving ? 'Saving...' : (
              <>
                <Save size={16} className="mr-2" /> {isNewPost ? 'Create Post' : 'Update Post'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
