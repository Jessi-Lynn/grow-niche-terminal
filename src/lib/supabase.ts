
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseIntegration } from '@/integrations/supabase/client';

// Use the Supabase integration client directly
export const supabase = supabaseIntegration;

// Helper to check if proper credentials are configured
export const isSupabaseConfigured = true;

// Ensure storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    console.log('Checking storage buckets...');
    
    // Check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return false;
    }
    
    console.log('Existing buckets:', buckets);
    
    // Create blog_images bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'blog_images')) {
      const { error: createError } = await supabase.storage.createBucket('blog_images', {
        public: true
      });
      
      if (createError) {
        console.error('Error creating blog_images bucket:', createError);
      } else {
        console.log('Created blog_images bucket');
      }
    }
    
    // Create blueprints bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'blueprints')) {
      const { error: createError } = await supabase.storage.createBucket('blueprints', {
        public: true
      });
      
      if (createError) {
        console.error('Error creating blueprints bucket:', createError);
      } else {
        console.log('Created blueprints bucket');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error creating storage buckets:', error);
    return false;
  }
};
