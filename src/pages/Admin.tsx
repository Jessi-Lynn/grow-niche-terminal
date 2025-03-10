
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';
import BlogPostList from '@/components/admin/blog/BlogPostList';
import BlueprintFileUpload from '@/components/admin/blueprints/BlueprintFileUpload';
import BlueprintDetailsForm from '@/components/admin/blueprints/BlueprintDetailsForm';
import RequirementsList from '@/components/admin/blueprints/RequirementsList';

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
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blueprints');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
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

  useEffect(() => {
    if (isSupabaseConfigured && activeTab === 'blog') {
      fetchBlogPosts();
    }
  }, [activeTab]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleCreateNewPost = () => {
    setSelectedPost({
      id: '',
      title: '',
      excerpt: '',
      content: '',
      author: '',
      slug: '',
      date: new Date().toISOString(),
      read_time: '5 min read',
      featured: false,
      tags: []
    });
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const handlePostSaved = () => {
    fetchBlogPosts();
    setSelectedPost(null);
    toast({
      title: 'Success',
      description: 'Blog post saved successfully',
    });
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchBlogPosts();
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

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

  const renderBlueprintTab = () => (
    <div className="glass-panel p-6 rounded-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BlueprintFileUpload 
          file={file} 
          onFileChange={handleFileChange} 
        />
        
        <Separator className="bg-terminal-white/10" />
        
        <BlueprintDetailsForm 
          formData={formData}
          categories={categories}
          onInputChange={handleInputChange}
        />
        
        <Separator className="bg-terminal-white/10" />
        
        <RequirementsList
          requirements={formData.requirements}
          onRequirementChange={handleRequirementChange}
          onAddRequirement={addRequirement}
          onRemoveRequirement={removeRequirement}
        />
        
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
  );

  const renderBlogTab = () => {
    if (selectedPost) {
      return (
        <BlogPostForm
          post={selectedPost}
          onSaved={handlePostSaved}
          onCancel={() => setSelectedPost(null)}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-terminal-white">Blog Posts</h2>
          <Button 
            onClick={handleCreateNewPost}
            className="bg-terminal-red hover:bg-terminal-red/80 text-terminal-black"
          >
            <Plus size={16} className="mr-2" /> New Post
          </Button>
        </div>
        
        <div className="glass-panel rounded-md p-6">
          <BlogPostList
            posts={blogPosts}
            loading={loading}
            onNewPost={handleCreateNewPost}
            onEditPost={handleEditPost}
            onViewPost={handleViewPost}
            onDeletePost={handleDeletePost}
          />
        </div>
      </div>
    );
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
            {isSupabaseConfigured 
              ? "Manage your blueprints and blog posts. All fields marked with * are required."
              : "⚠️ Supabase configuration is missing. Please add the required environment variables to enable dashboard functionality."}
          </Terminal>
          
          {!isSupabaseConfigured && (
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="blueprints" className="data-[state=active]:bg-terminal-red data-[state=active]:text-terminal-black">
                Blueprints
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-terminal-red data-[state=active]:text-terminal-black">
                Blog Posts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="blueprints" className="mt-6">
              {renderBlueprintTab()}
            </TabsContent>
            
            <TabsContent value="blog" className="mt-6">
              {renderBlogTab()}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Admin;
