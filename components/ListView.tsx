'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface ListViewProps {
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

export function ListView({ fixtures, onFixtureClick }: ListViewProps) {
  const sortedFixtures = fixtures.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  if (sortedFixtures.length === 0) {
    return (
      <div className="glass-strong rounded-2xl shadow-xl p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Fixtures Found</h3>
        <p className="text-gray-500">Try adjusting your filters or date range</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedFixtures.map((fixture) => (
        <button
          key={fixture.id}
          data-testid={`list-fixture-${fixture.id}`}
          onClick={() => onFixtureClick(fixture)}
          className="w-full text-left glass-strong rounded-2xl shadow-lg hover:shadow-xl transition-all p-4 md:p-5 border-2 hover:scale-[1.01] active:scale-[0.99]"
          style={{
            borderColor: `${fixture.sport.color}40`,
          }}
        >
          {/* Sport Tag and Status */}
          <div className="flex items-center justify-between mb-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-md"
              style={{
                background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
              }}
            >
              <span>{fixture.sport.name}</span>
            </div>
            {fixture.status !== 'scheduled' && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  fixture.status === 'postponed'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
              </span>
            )}
          </div>

          {/* Title - Competition/Category */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{fixture.title}</h3>
          {fixture.competition && (
            <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <span>{fixture.competition}</span>
              {fixture.round && <span>· {fixture.round}</span>}
              {fixture.is_home !== null && fixture.is_home !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${fixture.is_home ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                  {fixture.is_home ? 'Home' : 'Away'}
                </span>
              )}
            </div>
          )}

          {/* Teams - Only show for sports matches, not events */}
          {fixture.sport.slug !== 'events' && fixture.home_team && fixture.away_team && (
            <div className="text-base md:text-lg font-bold text-gray-900 mb-4 leading-relaxed">
              <span className="text-gray-900">{fixture.home_team}</span>
              <span className="text-gray-400 font-normal mx-2">vs</span>
              <span className="text-gray-900">{fixture.away_team}</span>
            </div>
          )}

          {/* Description for Events */}
          {fixture.sport.slug === 'events' && fixture.notes && (
            <p className="text-base text-gray-600 mb-4 leading-relaxed">{fixture.notes}</p>
          )}

          {/* Details Grid - Clear Labels and Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Date</div>
                <div className="font-semibold text-gray-900">{formatDate(fixture.start_time, 'EEE, MMM d')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Time</div>
                <div className="font-semibold text-gray-900">{formatTime(fixture.start_time)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Field</div>
                <div className="font-semibold text-gray-900">{fixture.field}</div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
