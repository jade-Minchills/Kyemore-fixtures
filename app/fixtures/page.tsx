import { createClient } from '@/lib/supabase/server';
import { FixturesClient } from '@/components/FixturesClient';
import { Sport, Event, FixtureWithSport } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FixturesPage() {
  const supabase = await createClient();

  // Fetch sports
  const { data: sports, error: sportsError } = await supabase
    .from('sports')
    .select('*')
    .eq('is_active', true)
    .order('name');

  // Fetch fixtures with sports data
  const { data: fixtures, error: fixturesError } = await supabase
    .from('fixtures')
    .select(`
      *,
      sport:sports(*)
    `)
    .order('start_time');

  // Fetch manually-created events
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('start_datetime');

  if (sportsError || fixturesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Fixtures</h1>
          <p className="text-gray-600">
            {sportsError?.message || fixturesError?.message}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Please check your Supabase configuration in .env.local
          </p>
        </div>
      </div>
    );
  }

  // Resolve the "Events" sport for mapping manual events into the unified list
  const eventsSport: Sport = (sports || []).find((s: Sport) => s.slug === 'events') ?? {
    id: 'events',
    name: 'Events',
    slug: 'events',
    color: '#8B5CF6',
    icon: 'calendar',
    is_active: true,
    created_at: '',
  };

  // Convert manual events to FixtureWithSport shape so all views render them
  const eventsAsFixtures: FixtureWithSport[] = (eventsError ? [] : (events || [])).map(
    (event: Event) => ({
      id: event.id,
      sport_id: eventsSport.id,
      title: event.title,
      home_team: null,
      away_team: null,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      field: event.venue,
      location_name: 'Kylemore Sports Ground',
      competition: null,
      round: null,
      is_home: null,
      status: event.status,
      notes: event.description,
      created_at: event.created_at,
      sport: eventsSport,
    })
  );

  const allFixtures: FixtureWithSport[] = [
    ...(fixtures || []) as FixtureWithSport[],
    ...eventsAsFixtures,
  ];

  return (
    <FixturesClient
      sports={(sports || []) as Sport[]}
      fixtures={allFixtures}
    />
  );
}
