
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPostProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

const BlogPost = ({
  title,
  excerpt,
  date,
  author,
  readTime,
  slug,
  featured = false
}: BlogPostProps) => {
  return (
    <div className={`
      border-b border-terminal-gray last:border-b-0 py-8
      ${featured ? 'bg-terminal-gray/10 px-6 rounded-md' : ''}
    `}>
      {featured && (
        <div className="mb-3">
          <span className="text-xs bg-terminal-red text-terminal-black px-2 py-0.5 rounded-sm">
            Featured
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2 text-terminal-white hover:text-terminal-red transition-colors duration-300">
        <Link to={`/blog/${slug}`}>{title}</Link>
      </h3>
      
      <div className="flex flex-wrap gap-4 mb-3 text-xs text-terminal-white/60">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {date}
        </div>
        <div className="flex items-center">
          <User size={14} className="mr-1" />
          {author}
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          {readTime}
        </div>
      </div>
      
      <p className="text-sm text-terminal-white/70 mb-4">
        {excerpt}
      </p>
      
      <Link 
        to={`/blog/${slug}`}
        className="text-terminal-red hover:underline text-sm"
      >
        Read more
      </Link>
    </div>
  );
};

export default BlogPost;
