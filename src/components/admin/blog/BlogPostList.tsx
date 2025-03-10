
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash, Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

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

interface BlogPostListProps {
  posts: BlogPost[];
  loading: boolean;
  onNewPost: () => void;
  onEditPost: (post: BlogPost) => void;
  onViewPost: (slug: string) => void;
  onDeletePost: (id: string) => void;
}

const BlogPostList = ({
  posts,
  loading,
  onNewPost,
  onEditPost,
  onViewPost,
  onDeletePost
}: BlogPostListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-terminal-white">Loading blog posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText size={48} className="text-terminal-red mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-terminal-white mb-2">No Blog Posts Yet</h3>
        <p className="text-terminal-white/70 mb-4">
          Create your first blog post to get started
        </p>
        <Button 
          onClick={onNewPost}
          className="bg-terminal-red hover:bg-terminal-red/80 text-terminal-black"
        >
          <Plus size={16} className="mr-2" /> Create First Post
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium text-terminal-white">
              {post.title}
            </TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>{format(new Date(post.date), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              {post.featured ? (
                <span className="px-2 py-1 text-xs rounded-full bg-terminal-red/20 text-terminal-red">
                  Featured
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded-full bg-terminal-gray/20 text-terminal-white/70">
                  Regular
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onViewPost(post.slug)}
                  className="h-8 w-8"
                >
                  <Eye size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEditPost(post)}
                  className="h-8 w-8"
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onDeletePost(post.id)}
                  className="h-8 w-8 border-terminal-red/50 text-terminal-red hover:bg-terminal-red/10"
                >
                  <Trash size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BlogPostList;
