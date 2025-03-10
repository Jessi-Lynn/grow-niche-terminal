
import { createClient } from '@supabase/supabase-js';

// Use environment variables with more robust fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log warning if real values are not provided
if (supabaseUrl === 'https://example.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('Using placeholder Supabase credentials. Set proper environment variables for production use.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = (
  supabaseUrl !== 'https://example.supabase.co' && 
  supabaseKey !== 'your-anon-key'
);

// Add the SQL command that should be run on the Supabase database:
/**
 * -- Add SEO meta fields to blog_posts table
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image text;
 */
