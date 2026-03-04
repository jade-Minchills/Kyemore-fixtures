import { createClient } from '@/lib/supabase/server';
import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { addDays } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    sport?: string;
    field?: string;
    view?: 'list' | 'week' | 'month';
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
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
                className="p-5 rounded-xl border-2 shadow-sm hover:shadow-md transition-all"
                style={{
                  borderColor: `${fixture.sport.color}40`,
                  background: `linear-gradient(135deg, ${fixture.sport.color}08 0%, ${fixture.sport.color}15 100%)`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
                    }}
                  >
                    <span>{fixture.sport.name}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {fixture.title}
                </h3>
                <p className="text-base text-gray-700 mb-3 font-medium">
                  {fixture.home_team} vs {fixture.away_team}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(fixture.start_time, 'EEE, MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatTime(fixture.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{fixture.field}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredFixtures.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg">No upcoming fixtures found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">\n            <p className="text-gray-600 text-center">\n              Calendar and month views are available on the main site.\n              <br />\n              <a href="/fixtures" className="text-green-600 hover:text-green-700 font-medium">\n                View full calendar →\n              </a>\n            </p>\n          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Kylemore Sports Ground • Updated in real-time</p>
        </div>
      </div>
    </div>
  );
}
