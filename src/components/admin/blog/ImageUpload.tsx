
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  type: 'main' | 'og';
  slug: string;
}

const ImageUpload = ({ imageUrl, onImageUploaded, onImageRemoved, type, slug }: ImageUploadProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.match(/image\/jpe?g/i)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPEG image file.',
          variant: 'destructive',
        });
        return;
      }
      
      setImageFile(file);
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File): Promise<void> => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${slug || 'post'}-${fileName}`;
      
      console.log(`Uploading ${type} image to path: ${filePath}`);
      
      // Check if the bucket exists
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        throw bucketsError;
      }
      
      const blogImagesBucketExists = buckets.some(bucket => bucket.name === 'blog_images');
      
      if (!blogImagesBucketExists) {
        console.error('blog_images bucket does not exist');
        toast({
          title: 'Storage Error',
          description: 'The blog_images storage bucket does not exist. Please contact an administrator.',
          variant: 'destructive',
        });
        return;
      }
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error(`Error uploading ${type} image:`, uploadError);
        throw uploadError;
      }
      
      console.log(`Successfully uploaded ${type} image:`, data);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
        
      console.log(`Public URL for ${type} image:`, publicUrl);
      
      onImageUploaded(publicUrl);
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: 'Upload Error',
        description: `Failed to upload ${type === 'main' ? 'main' : 'OG'} image: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

  if (previewUrl) {
    return (
      <div className="space-y-3">
        <div className="mt-2 relative">
          <img 
            src={previewUrl} 
            alt={type === 'main' ? "Main article image" : "OG image preview"} 
            className="rounded-md max-h-40 object-cover border border-terminal-white/20" 
          />
          <button
            type="button"
            onClick={onImageRemoved}
            className="absolute top-2 right-2 bg-terminal-black/70 p-1 rounded-full hover:bg-terminal-red/70"
          >
            <X size={16} className="text-terminal-white" />
          </button>
        </div>
        
        <label className="flex items-center justify-center cursor-pointer text-terminal-red hover:text-terminal-red/80">
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg,image/jpg"
            onChange={handleFileChange} 
          />
          <span className="flex items-center">
            <Upload size={14} className="mr-1" /> Change image
          </span>
        </label>
      </div>
    );
  }

  return (
    <label className="cursor-pointer block w-full text-center">
      <input 
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/jpg"
        onChange={handleFileChange} 
      />
      <div className="space-y-2">
        {type === 'main' ? (
          <ImageIcon className="mx-auto h-12 w-12 text-terminal-red" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-terminal-white/60" />
        )}
        
        <p className={`${type === 'main' ? 'text-terminal-white' : 'text-sm text-terminal-white'}`}>
          {type === 'main' 
            ? 'Drag & drop your JPEG image here or ' 
            : 'Upload JPEG image for social sharing'}
          {type === 'main' && <span className="text-terminal-red underline">browse</span>}
        </p>
        
        {type === 'main' && (
          <p className="text-xs text-terminal-white/70">
            This image will be displayed at the top of your blog post
          </p>
        )}
      </div>
    </label>
  );
};

export default ImageUpload;
