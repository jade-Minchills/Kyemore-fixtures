'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { useEffect } from 'react';

interface DayEventsSheetProps {
  date: Date | null;
  fixtures: FixtureWithSport[];
  onClose: () => void;
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

export function DayEventsSheet({ date, fixtures, onClose, onFixtureClick }: DayEventsSheetProps) {
  useEffect(() => {
    if (date) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [date]);

  if (!date) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col bg-white rounded-t-3xl shadow-2xl animate-slide-up"
        style={{ maxHeight: '75dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {formatDate(date.toISOString(), 'EEEE, MMMM d')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {fixtures.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-lg">No fixtures scheduled</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {fixtures.map((fixture) => (
                <button
                  key={fixture.id}
                  onClick={() => {
                    onFixtureClick(fixture);
                    onClose();
                  }}
                  className="w-full text-left glass-strong rounded-2xl shadow-lg hover:shadow-xl transition-all p-5 border-2 active:scale-[0.98]"
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
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
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
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
