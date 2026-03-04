import { createClient } from '@/lib/supabase/server';
import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { addDays } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    sport?: string;
    field?: string;
    view?: 'calendar' | 'list';
    days?: string;
  }>;
}

export default async function EmbedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { sport, field, view = 'list', days = '7' } = params;

  const supabase = await createClient();
  const daysAhead = parseInt(days) || 7;
  const endDate = addDays(new Date(), daysAhead);

  // Build query
  let query = supabase
    .from('fixtures')
    .select(`
      *,
      sport:sports(*)
    `)
    .eq('status', 'scheduled')
    .gte('start_time', new Date().toISOString())
    .lte('start_time', endDate.toISOString())
    .order('start_time');

  // Apply filters
  if (field) {
    query = query.eq('field', field);
  }

  const { data: fixtures } = await query;
  let filteredFixtures = (fixtures || []) as FixtureWithSport[];

  // Filter by sport if specified
  if (sport) {
    filteredFixtures = filteredFixtures.filter(
      f => f.sport?.slug === sport
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kylemore Sports Ground Fixtures
          </h1>
          {sport && (
            <p className="text-gray-600">
              Showing {sport.charAt(0).toUpperCase() + sport.slice(1)} fixtures
            </p>
          )}
        </div>

        {view === 'list' ? (
          <div className="space-y-3">
            {filteredFixtures.map((fixture) => (
              <div
                key={fixture.id}
                data-testid={`embed-fixture-${fixture.id}`}
                className="p-4 rounded-lg border-2 shadow-sm"
                style={{
                  borderColor: fixture.sport.color,
                  backgroundColor: `${fixture.sport.color}10`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div
                      className="inline-block px-2 py-1 rounded text-white text-xs font-bold mb-2"
                      style={{ backgroundColor: fixture.sport.color }}
                    >
                      {fixture.sport.name}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {fixture.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      {fixture.home_team} vs {fixture.away_team}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📅 {formatDate(fixture.start_time, 'EEE, MMM d, yyyy')}</span>
                      <span>🕒 {formatTime(fixture.start_time)}</span>
                      <span>📍 {fixture.field}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredFixtures.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No upcoming fixtures found
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 text-center">
              Calendar view coming soon. Use view=list for now.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Kylemore Sports Ground • Updated in real-time</p>
        </div>
      </div>
    </div>
  );
}
