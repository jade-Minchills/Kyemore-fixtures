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
          className="w-full text-left glass-strong rounded-2xl shadow-lg hover:shadow-xl transition-all p-5 border-2 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderColor: `${fixture.sport.color}40`,
          }}
        >
          {/* Sport Tag */}
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

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{fixture.title}</h3>

          {/* Teams */}
          <div className="text-base text-gray-700 mb-3 font-medium">
            {fixture.home_team} <span className="text-gray-400">vs</span> {fixture.away_team}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(fixture.start_time, 'EEE, MMM d')}</span>
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
        </button>
      ))}
    </div>
  );
}
