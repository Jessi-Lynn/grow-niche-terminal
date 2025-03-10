
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', 
  supabaseKey || 'your-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Helper to check if proper credentials are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey &&
  supabaseUrl !== 'https://example.supabase.co' && 
  supabaseKey !== 'your-anon-key'
);

// Check if credentials are missing and log a warning
if (!isSupabaseConfigured) {
  console.warn('Using placeholder Supabase credentials. Set proper environment variables in your .env.local file.');
  console.info('Required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

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
