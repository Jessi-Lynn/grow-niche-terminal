
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Save, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
}

interface BlogPostFormProps {
  post: BlogPost;
  onSaved: () => void;
  onCancel: () => void;
}

const BlogPostForm = ({ post, onSaved, onCancel }: BlogPostFormProps) => {
  const [formData, setFormData] = useState<BlogPost>(post);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const isNewPost = !post.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'title' && !formData.slug && isNewPost) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData({ ...formData, slug });
    }
    
    // Auto-fill meta title from regular title if not already set
    if (name === 'title' && isNewPost && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: value }));
    }
    
    // Auto-fill meta description from excerpt if not already set
    if (name === 'excerpt' && isNewPost && !formData.meta_description) {
      setFormData(prev => ({ ...prev, meta_description: value }));
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
      
      const postData = {
        ...formData,
        date: formData.date || new Date().toISOString(),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };
      
      let result;
      
      if (isNewPost) {
        // Insert new post
        result = await supabase
          .from('blog_posts')
          .insert(postData)
          .select();
      } else {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', formData.id)
          .select();
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Success!',
        description: `Blog post ${isNewPost ? 'created' : 'updated'} successfully`,
      });
      
      onSaved();
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isNewPost ? 'create' : 'update'} blog post`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-terminal-white">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="An engaging title for your blog post"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-terminal-white">
              Slug * (URL-friendly identifier)
            </Label>
            <Input
              id="slug"
              name="slug"
              placeholder="blog-post-url-slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author" className="text-terminal-white">
              Author *
            </Label>
            <Input
              id="author"
              name="author"
              placeholder="Author name"
              value={formData.author}
              onChange={handleInputChange}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="read_time" className="text-terminal-white">
              Read Time
            </Label>
            <Input
              id="read_time"
              name="read_time"
              placeholder="5 min read"
              value={formData.read_time}
              onChange={handleInputChange}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="excerpt" className="text-terminal-white">
              Excerpt * (1-2 sentences summary)
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="A brief overview of what this post is about"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              required
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="content" className="text-terminal-white">
              Content *
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="The full content of your blog post"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 text-terminal-red"
              />
              <Label htmlFor="featured" className="text-terminal-white ml-2">
                Featured Post (appears highlighted)
              </Label>
            </div>
          </div>
        </div>
        
        <Separator className="bg-terminal-white/10" />
        
        {/* SEO Meta Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-terminal-white">SEO Meta Information</h2>
          <p className="text-sm text-terminal-white/70">
            These fields help improve your post's visibility in search engines.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title" className="text-terminal-white">
                Meta Title <span className="text-terminal-white/70 text-xs">(Recommended: 50-60 characters)</span>
              </Label>
              <Input
                id="meta_title"
                name="meta_title"
                placeholder="SEO-optimized title for search engines"
                value={formData.meta_title || ''}
                onChange={handleInputChange}
                className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              />
              {formData.meta_title && (
                <p className="text-xs text-terminal-white/70">
                  Length: {formData.meta_title.length} characters
                  {formData.meta_title.length > 60 && (
                    <span className="text-terminal-red ml-1">
                      (Too long! Try to keep it under 60 characters)
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="og_image" className="text-terminal-white">
                OG Image URL <span className="text-terminal-white/70 text-xs">(Social sharing image)</span>
              </Label>
              <Input
                id="og_image"
                name="og_image"
                placeholder="https://example.com/image.jpg"
                value={formData.og_image || ''}
                onChange={handleInputChange}
                className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta_description" className="text-terminal-white">
                Meta Description <span className="text-terminal-white/70 text-xs">(Recommended: 150-160 characters)</span>
              </Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                placeholder="Concise description for search engine results"
                value={formData.meta_description || ''}
                onChange={handleInputChange}
                rows={2}
                className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              />
              {formData.meta_description && (
                <p className="text-xs text-terminal-white/70">
                  Length: {formData.meta_description.length} characters
                  {formData.meta_description.length > 160 && (
                    <span className="text-terminal-red ml-1">
                      (Too long! Try to keep it under 160 characters)
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta_keywords" className="text-terminal-white">
                Meta Keywords <span className="text-terminal-white/70 text-xs">(Comma-separated)</span>
              </Label>
              <Input
                id="meta_keywords"
                name="meta_keywords"
                placeholder="niche, marketing, growth, automation"
                value={formData.meta_keywords || ''}
                onChange={handleInputChange}
                className="bg-terminal-black border-terminal-white/20 text-terminal-white"
              />
              <p className="text-xs text-terminal-white/70">
                Note: While less important now, keywords can still help with content categorization
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-terminal-white/10" />
        
        <div className="space-y-4">
          <Label htmlFor="tags" className="text-terminal-white">
            Tags
          </Label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
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
