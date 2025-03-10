
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  Undo, 
  Redo 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  slug: string;
}

const RichTextEditor = ({ content, onChange, slug }: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editorContent, setEditorContent] = useState(content);

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
  });

  // Update editor content when the prop changes
  useEffect(() => {
    if (editor && content !== editorContent) {
      editor.commands.setContent(content);
      setEditorContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${slug}-content-${Date.now()}.${fileExt}`;
      const filePath = `content/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
      
      if (editor) {
        editor.chain().focus().setImage({ src: publicUrl }).run();
      }
      
      toast({
        title: 'Image uploaded',
        description: 'Image has been added to the editor',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a valid image file (JPEG, PNG, GIF, WebP).',
          variant: 'destructive',
        });
        return;
      }
      
      handleImageUpload(file);
    }
  };

  const handleSetLink = () => {
    if (!linkUrl) return;
    
    // Add https:// if not present
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
  };

  if (!editor) {
    return <div className="border border-terminal-white/20 rounded-md p-4 text-terminal-white">Loading editor...</div>;
  }

  const toolbar = [
    {
      icon: <Bold size={18} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <Italic size={18} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <UnderlineIcon size={18} />,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      icon: <Heading1 size={18} />,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 size={18} />,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <List size={18} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered size={18} />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: <Code size={18} />,
      title: 'Code',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      icon: <Undo size={18} />,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: <Redo size={18} />,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className="border border-terminal-white/20 rounded-md overflow-hidden">
      <div className="bg-terminal-black border-b border-terminal-white/20 p-2 flex flex-wrap gap-1 items-center">
        {toolbar.map((item, index) => (
          <Button
            key={index}
            onClick={item.action}
            type="button"
            variant="ghost"
            size="sm"
            title={item.title}
            className={`h-8 px-2 text-terminal-white ${
              item.isActive ? 'bg-terminal-red/20' : 'hover:bg-terminal-red/10'
            }`}
          >
            {item.icon}
          </Button>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Add Link"
              className="h-8 px-2 text-terminal-white hover:bg-terminal-red/10"
            >
              <LinkIcon size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-terminal-black border-terminal-white/20 text-terminal-white">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 bg-terminal-black border-terminal-white/20 text-terminal-white"
              />
              <Button
                type="button"
                onClick={handleSetLink}
                className="bg-terminal-red hover:bg-terminal-red/80 text-terminal-black"
              >
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            title="Insert Image"
            className="h-8 px-2 text-terminal-white hover:bg-terminal-red/10"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : <ImageIcon size={18} />}
          </Button>
          <input
            type="file"
            className="hidden"
            onChange={handleImageFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={isUploading}
          />
        </label>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 min-h-[300px] bg-terminal-black text-terminal-white"
      />
    </div>
  );
};

export default RichTextEditor;
