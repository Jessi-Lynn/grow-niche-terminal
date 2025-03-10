
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPost from '@/components/BlogPost';
import Terminal from '@/components/Terminal';
import { Search, Tag, Calendar } from 'lucide-react';
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
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
      
      // Extract all unique tags
      const tags = [...new Set(data?.flatMap(post => post.tags) || [])];
      setAllTags(tags);
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
  
  // Filter blog posts based on search term and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured);
  
  const formatDate = (dateString: string) => {
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              <span className="text-terminal-red">Blog</span> & Resources
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              Insights, guides, and case studies on automation and business process optimization.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/blog" className="mx-auto">
              Explore our latest articles on automation strategies, JSON blueprints, and success stories.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Search and Filter */}
      <section className="pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel p-6 rounded-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-white/50" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full bg-terminal-black border border-terminal-gray rounded-md py-2 pl-10 pr-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tag size={18} className="text-terminal-white/50" />
                <span className="text-sm text-terminal-white/70">Filter by Tag:</span>
                <select
                  className="bg-terminal-black border border-terminal-gray rounded-md py-2 px-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="All">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-terminal-white">
              <span className="text-terminal-red">Featured</span> Article
            </h2>
            
            <div className="glass-panel rounded-md p-6">
              <div className="mb-2">
                <span className="text-xs bg-terminal-red text-terminal-black px-2 py-0.5 rounded-sm">
                  Featured
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-terminal-white hover:text-terminal-red transition-colors duration-300">
                <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h3>
              
              <div className="flex flex-wrap gap-4 mb-3 text-xs text-terminal-white/60">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(featuredPost.date)}
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {featuredPost.author}
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {featuredPost.read_time}
                </div>
              </div>
              
              <p className="text-terminal-white/70 mb-4">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredPost.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-terminal-gray/30 text-terminal-white/80 px-2 py-1 rounded cursor-pointer hover:bg-terminal-gray/40"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <Link 
                to={`/blog/${featuredPost.slug}`}
                className="text-terminal-red hover:underline text-sm inline-flex items-center"
              >
                Read full article
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Blog Posts */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6 text-terminal-white">
            Latest <span className="text-terminal-red">Articles</span>
          </h2>
          
          <div className="glass-panel rounded-md divide-y divide-terminal-gray/50">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-terminal-white">Loading blog posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <BlogPost
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={formatDate(post.date)}
                  author={post.author}
                  readTime={post.read_time}
                  slug={post.slug}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-terminal-red mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-terminal-white mb-2">No Articles Found</h3>
                <p className="text-terminal-white/70">
                  We couldn't find any articles matching your search criteria. Please try a different search term or tag.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-terminal-white mb-4">
              Stay Updated
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-6">
              Subscribe to our newsletter for the latest articles, tips, and automation insights.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow bg-terminal-black border border-terminal-gray rounded-l py-2 px-4 text-terminal-white focus:outline-none focus:border-terminal-red transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="bg-terminal-red text-terminal-black py-2 px-6 rounded-r font-mono font-bold"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-terminal-white/50 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
