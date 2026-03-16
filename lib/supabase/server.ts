import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock client for when Supabase is not configured
class MockSupabaseClient {
  from(table: string) {
    return {
      select: () => this.createChain(table),
      insert: () => this.createChain(table),
      update: () => this.createChain(table),
      delete: () => this.createChain(table),
    };
  }

  private createChain(table: string) {
    const chain = {
      eq: () => chain,
      neq: () => chain,
      gte: () => chain,
      lte: () => chain,
      order: () => chain,
      limit: () => chain,
      single: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: (result: { data: unknown[]; error: null }) => void) => {
        // Return sample data for fixtures page
        if (table === 'sports') {
          resolve({ data: getSampleSports(), error: null });
        } else if (table === 'fixtures') {
          resolve({ data: getSampleFixtures(), error: null });
        } else if (table === 'events') {
          resolve({ data: [], error: null });
        } else {
          resolve({ data: [], error: null });
        }
      },
    };
    return chain;
  }

  auth = {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  };
}

// Sample data for demo mode
function getSampleSports() {
  return [
    { id: '1', name: 'Rugby', slug: 'rugby', color: '#10B981', icon: '🏉', is_active: true },
    { id: '2', name: 'Soccer', slug: 'soccer', color: '#F59E0B', icon: '⚽', is_active: true },
    { id: '3', name: 'Events', slug: 'events', color: '#8B5CF6', icon: '🎉', is_active: true },
  ];
}

function getSampleFixtures() {
  return [];
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
    console.log('⚠️ Supabase not configured - using demo mode with sample data');
    return new MockSupabaseClient() as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}