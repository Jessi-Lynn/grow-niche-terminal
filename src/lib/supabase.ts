
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseIntegration } from '@/integrations/supabase/client';

// Use the Supabase integration client directly
export const supabase = supabaseIntegration;

// Helper to check if proper credentials are configured
export const isSupabaseConfigured = true;

// Ensure storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    // Check if buckets exist
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create blog_images bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'blog_images')) {
      await supabase.storage.createBucket('blog_images', {
        public: true
      });
      console.log('Created blog_images bucket');
    }
    
    // Create blueprints bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'blueprints')) {
      await supabase.storage.createBucket('blueprints', {
        public: true
      });
      console.log('Created blueprints bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating storage buckets:', error);
    return false;
  }
};
