import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  slug: string;
  tags: string[];
  featured: boolean;
  image: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Blog post not found');
      toast({
        title: 'Error',
        description: 'Failed to load blog post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link 
            to="/blog"
            className="inline-flex items-center text-terminal-white hover:text-terminal-red mb-8"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
          
          {loading ? (
            <div className="glass-panel p-8 rounded-md text-center">
              <p className="text-terminal-white">Loading post...</p>
            </div>
          ) : error ? (
            <div className="glass-panel p-8 rounded-md text-center">
              <h2 className="text-2xl font-bold text-terminal-white mb-4">{error}</h2>
              <p className="text-terminal-white/70 mb-6">
                The blog post you're looking for doesn't exist or has been moved.
              </p>
              <Link 
                to="/blog"
                className="bg-terminal-red text-terminal-black px-6 py-2 rounded font-mono font-bold"
              >
                Return to Blog
              </Link>
            </div>
          ) : post ? (
            <article className="glass-panel p-8 rounded-md">
              {post.featured && (
                <div className="mb-4">
                  <span className="text-xs bg-terminal-red text-terminal-black px-2 py-0.5 rounded-sm">
                    Featured
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-terminal-white">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 mb-8 text-sm text-terminal-white/60 border-b border-terminal-gray/30 pb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(post.date)}
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  {post.read_time}
                </div>
              </div>

              {post.image && (
                <div className="mb-8">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              )}
              
              <div 
                className="prose prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {post.tags && post.tags.length > 0 && (
                <div className="border-t border-terminal-gray/30 pt-6 mt-8">
                  <h3 className="text-terminal-white font-bold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link 
                        key={index}
                        to={`/blog?tag=${tag}`}
                        className="text-sm bg-terminal-gray/30 text-terminal-white/80 px-3 py-1 rounded hover:bg-terminal-gray/40"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ) : null}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
