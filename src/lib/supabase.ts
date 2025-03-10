
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks to prevent builds from failing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not found. Some features may not work correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Add the SQL command that should be run on the Supabase database:
/**
 * -- Add SEO meta fields to blog_posts table
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords text;
 * ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image text;
 */
