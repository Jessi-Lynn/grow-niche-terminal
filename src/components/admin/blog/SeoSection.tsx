
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

interface SeoSectionProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage?: string;
  slug: string;
  onMetaChange: (field: string, value: string) => void;
  onOgImageUploaded: (url: string) => void;
  onOgImageRemoved: () => void;
}

const SeoSection = ({
  metaTitle,
  metaDescription,
  metaKeywords,
  ogImage,
  slug,
  onMetaChange,
  onOgImageUploaded,
  onOgImageRemoved
}: SeoSectionProps) => {
  return (
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
            value={metaTitle}
            onChange={(e) => onMetaChange('meta_title', e.target.value)}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
          />
          {metaTitle && (
            <p className="text-xs text-terminal-white/70">
              Length: {metaTitle.length} characters
              {metaTitle.length > 60 && (
                <span className="text-terminal-red ml-1">
                  (Too long! Try to keep it under 60 characters)
                </span>
              )}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="og_image" className="text-terminal-white">
            OG Image <span className="text-terminal-white/70 text-xs">(Social sharing image)</span>
          </Label>
          
          <div className="border-2 border-dashed border-terminal-white/20 rounded-md p-4">
            <ImageUpload
              imageUrl={ogImage}
              onImageUploaded={onOgImageUploaded}
              onImageRemoved={onOgImageRemoved}
              type="og"
              slug={slug}
            />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="meta_description" className="text-terminal-white">
            Meta Description <span className="text-terminal-white/70 text-xs">(Recommended: 150-160 characters)</span>
          </Label>
          <Textarea
            id="meta_description"
            name="meta_description"
            placeholder="Concise description for search engine results"
            value={metaDescription}
            onChange={(e) => onMetaChange('meta_description', e.target.value)}
            rows={2}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
          />
          {metaDescription && (
            <p className="text-xs text-terminal-white/70">
              Length: {metaDescription.length} characters
              {metaDescription.length > 160 && (
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
            value={metaKeywords}
            onChange={(e) => onMetaChange('meta_keywords', e.target.value)}
            className="bg-terminal-black border-terminal-white/20 text-terminal-white"
          />
          <p className="text-xs text-terminal-white/70">
            Note: While less important now, keywords can still help with content categorization
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeoSection;
