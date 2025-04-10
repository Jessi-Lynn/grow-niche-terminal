
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from './RichTextEditor';

interface MainFormProps {
  title: string;
  slug: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string;
  featured: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

const MainForm = ({
  title,
  slug,
  author,
  readTime,
  excerpt,
  content,
  featured,
  onChange
}: MainFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-terminal-white">
          Title *
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="An engaging title for your blog post"
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
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
          value={slug}
          onChange={(e) => onChange('slug', e.target.value)}
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
          value={author}
          onChange={(e) => onChange('author', e.target.value)}
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
          value={readTime}
          onChange={(e) => onChange('read_time', e.target.value)}
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
          value={excerpt}
          onChange={(e) => onChange('excerpt', e.target.value)}
          rows={2}
          className="bg-terminal-black border-terminal-white/20 text-terminal-white"
          required
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="content" className="text-terminal-white">
          Content *
        </Label>
        <RichTextEditor
          content={content}
          onChange={(html) => onChange('content', html)}
          slug={slug || 'post'}
        />
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) => onChange('featured', checked === true)}
            className="h-4 w-4 text-terminal-red data-[state=checked]:bg-terminal-red data-[state=checked]:text-terminal-black"
          />
          <Label
            htmlFor="featured"
            className="text-terminal-white ml-2 cursor-pointer"
          >
            Featured Post (appears highlighted)
          </Label>
        </div>
      </div>
    </div>
  );
};

export default MainForm;
