'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface UpcomingFixturesProps {
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

export function UpcomingFixtures({ fixtures, onFixtureClick }: UpcomingFixturesProps) {
  const sortedFixtures = fixtures
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 6);

  return (
    <div className="glass-strong rounded-2xl shadow-xl p-6 sticky top-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 gradient-text" data-testid="upcoming-fixtures-title">
        Upcoming Fixtures
      </h2>
      <div className="space-y-3">
        {sortedFixtures.map((fixture) => (
          <button
            key={fixture.id}
            data-testid={`upcoming-fixture-${fixture.id}`}
            onClick={() => onFixtureClick(fixture)}
            className="w-full text-left p-4 rounded-xl border-2 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: `${fixture.sport.color}40`,
              background: `linear-gradient(135deg, ${fixture.sport.color}08 0%, ${fixture.sport.color}15 100%)`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md"
                style={{ 
                  background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
                }}
              >
                {formatDate(fixture.start_time, 'EEE').substring(0, 3).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(fixture.start_time, 'MMM d')}
                  <Clock className="w-3 h-3 ml-2" />
                  {formatTime(fixture.start_time)}
                </div>
                <div className="font-bold text-gray-900 mb-1">{fixture.title}:</div>
                <div className="text-sm text-gray-700 truncate">
                  {fixture.home_team} vs {fixture.away_team}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  {fixture.field}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}