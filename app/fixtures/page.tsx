import { createClient } from '@/lib/supabase/server';
import { FixturesClient } from '@/components/FixturesClient';
import { Sport, Fixture, FixtureWithSport } from '@/lib/types';

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

  const fixturesWithSport = (fixtures || []) as FixtureWithSport[];

  return (
    <FixturesClient 
      sports={(sports || []) as Sport[]} 
      fixtures={fixturesWithSport}
    />
  );
}
