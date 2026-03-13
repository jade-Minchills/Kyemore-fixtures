import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
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
  const today = new Date();
  const sports = getSampleSports();
  
  // Sample event titles and descriptions for "Events" type
  const eventTitles = [
    { title: 'Club Meeting', notes: 'Monthly club committee meeting to discuss upcoming fixtures and events.' },
    { title: 'Youth Training Camp', notes: 'Training session for U12 and U14 players. All skill levels welcome.' },
    { title: 'Awards Night', notes: 'End of season awards ceremony. Dinner included.' },
    { title: 'Fitness Session', notes: 'Open gym session with trainer available.' },
    { title: 'Fundraiser Quiz Night', notes: 'Table quiz fundraiser for new equipment. Teams of 4.' },
  ];
  
  // Generate fixtures for the current week
  const fixtures = [];
  let eventIndex = 0;
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i - today.getDay() + 1); // Start from Monday
    
    // Add 2-3 fixtures per day
    const fixtureCount = 2 + (i % 2);
    for (let j = 0; j < fixtureCount; j++) {
      const sport = sports[j % sports.length];
      const startHour = 9 + j * 3 + (i % 2); // Varied start times
      const startTime = new Date(day);
      startTime.setHours(startHour, j % 2 === 0 ? 0 : 30, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startHour + 1 + (j % 2), 0, 0, 0);
      
      // Handle Events differently - no teams, just title and description
      const isEvent = sport.slug === 'events';
      const eventData = isEvent ? eventTitles[eventIndex % eventTitles.length] : null;
      if (isEvent) eventIndex++;
      
      fixtures.push({
        id: `fixture-${i}-${j}`,
        sport_id: sport.id,
        title: isEvent ? eventData!.title : `${sport.name} Match ${j + 1}`,
        home_team: isEvent ? '' : `Home Team ${String.fromCharCode(65 + j)}`,
        away_team: isEvent ? '' : `Away Team ${String.fromCharCode(88 - j)}`,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        field: isEvent ? (j % 2 === 0 ? 'Clubhouse' : 'Gym') : `Field ${(j % 3) + 1}`,
        location_name: 'Kylemore Sports Ground',
        status: 'scheduled',
        notes: isEvent ? eventData!.notes : '',
        sport: sport,
      });
    }
  }
  
  return fixtures;
}

export async function createClient(): Promise<SupabaseClient | MockSupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
    console.log('⚠️ Supabase not configured - using demo mode with sample data');
    return new MockSupabaseClient() as unknown as SupabaseClient;
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