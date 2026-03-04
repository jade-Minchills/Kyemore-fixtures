import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Singleton client instance
let supabaseClient: SupabaseClient | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return null if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseKey);
  }
  
  return supabaseClient;
}