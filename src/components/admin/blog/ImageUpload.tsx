
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase, ensureStorageBuckets } from '@/lib/supabase';

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
      
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a valid image file (JPEG, PNG, GIF, WebP).',
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
      console.log(`Starting ${type} image upload process...`);
      
      // Ensure the blog_images bucket exists
      await ensureStorageBuckets();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${slug}-${type}-${Date.now()}.${fileExt}`;
      const folderPath = type === 'main' ? 'main' : 'og';
      const filePath = `${folderPath}/${fileName}`;
      
      console.log(`Uploading ${type} image to path: ${filePath}`);
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });
        
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
      
      toast({
        title: 'Upload successful',
        description: `${type === 'main' ? 'Main' : 'OG'} image uploaded successfully.`,
      });
      
      onImageUploaded(publicUrl);
    } catch (error: any) {
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

  // Render uploaded image with remove button
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
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange} 
            disabled={uploadingImage}
          />
          <span className="flex items-center">
            <Upload size={14} className="mr-1" /> 
            {uploadingImage ? 'Uploading...' : 'Change image'}
          </span>
        </label>
      </div>
    );
  }

  // Render upload button
  return (
    <label className="cursor-pointer block w-full text-center">
      <input 
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange} 
        disabled={uploadingImage}
      />
      <div className={`space-y-2 ${uploadingImage ? 'opacity-50' : ''}`}>
        {type === 'main' ? (
          <ImageIcon className="mx-auto h-12 w-12 text-terminal-red" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-terminal-white/60" />
        )}
        
        <p className={`${type === 'main' ? 'text-terminal-white' : 'text-sm text-terminal-white'}`}>
          {uploadingImage ? 'Uploading...' : (
            <>
              {type === 'main' 
                ? 'Drag & drop your image here or ' 
                : 'Upload image for social sharing'}
              {type === 'main' && <span className="text-terminal-red underline">browse</span>}
            </>
          )}
        </p>
        
        {type === 'main' && !uploadingImage && (
          <p className="text-xs text-terminal-white/70">
            This image will be displayed at the top of your blog post
          </p>
        )}
      </div>
    </label>
  );
};

export default ImageUpload;
