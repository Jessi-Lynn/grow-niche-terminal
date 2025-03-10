
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', 
  supabaseKey || 'your-anon-key'
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

