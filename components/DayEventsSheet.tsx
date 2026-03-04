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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet/Card Container - Responsive */}
      <div
        className="absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                   bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto
                   flex flex-col bg-white md:rounded-2xl rounded-t-3xl shadow-2xl animate-slide-up-mobile md:animate-fade-in
                   md:w-[90vw] md:max-w-2xl"
        style={{ maxHeight: '75dvh' }}
      >
        {/* Handle - Mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-green-50 to-teal-50">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            {formatDate(date.toISOString(), 'EEEE, MMMM d')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
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
            <div className="p-4 md:p-6 space-y-3">
              {fixtures
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((fixture) => (
                <button
                  key={fixture.id}
                  onClick={() => {
                    onFixtureClick(fixture);
                    onClose();
                  }}
                  className="w-full text-left glass-strong rounded-2xl shadow-lg hover:shadow-xl transition-all p-4 md:p-5 border-2 active:scale-[0.98]"
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

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{fixture.title}</h3>

                  {/* Teams - Prominent and Easy to Read */}
                  <div className="text-base md:text-lg text-gray-900 mb-3 font-semibold">
                    {fixture.home_team} <span className="text-gray-400 font-normal">vs</span> {fixture.away_team}
                  </div>

                  {/* Details Grid - Clear and Readable */}
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatTime(fixture.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{fixture.field}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
