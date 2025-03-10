
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
    },
  }
);

// Helper to check if proper credentials are configured
export const isSupabaseConfigured = (
  supabaseUrl && supabaseKey &&
  supabaseUrl !== 'https://example.supabase.co' && 
  supabaseKey !== 'your-anon-key'
);

// Check if credentials are missing and log a warning
if (!isSupabaseConfigured) {
  console.warn('Using placeholder Supabase credentials. Set proper environment variables in your .env.local file.');
  console.info('Required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Add the SQL command that should be run on the Supabase database:
/**
 * -- Add SEO meta fields to blog_posts table
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image text;
 */
