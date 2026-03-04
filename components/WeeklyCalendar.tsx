'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatDate, getTimePosition, getEventHeight } from '@/lib/date-utils';
import { format, isSameDay } from 'date-fns';

interface WeeklyCalendarProps {
  weekDays: Date[];
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

const TIME_SLOTS = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', 
  '6 PM', '7 PM', '8 PM'
];

export function WeeklyCalendar({ weekDays, fixtures, onFixtureClick }: WeeklyCalendarProps) {
  const today = new Date();

  const getFixturesForDay = (day: Date) => {
    return fixtures.filter(fixture => 
      isSameDay(new Date(fixture.start_time), day)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-8 border-b-2 border-gray-200">
        <div className="p-4 font-semibold text-gray-500 text-sm">Time</div>
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={index}
              data-testid={`calendar-day-${format(day, 'EEE').toLowerCase()}`}
              className={`p-4 text-center border-l-2 border-gray-200 ${
                isToday ? 'bg-green-50' : ''
              }`}
            >
              <div className="text-xs font-semibold text-gray-500 uppercase">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  isToday ? 'text-green-600' : 'text-gray-800'
                }`}
              >
                {format(day, 'd')}
              </div>
              {isToday && (
                <div className="mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full inline-block">
                  Today
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 relative" style={{ minHeight: '600px' }}>
        {/* Time Labels */}
        <div className="border-r-2 border-gray-200">
          {TIME_SLOTS.map((time, index) => (
            <div
              key={index}
              className="h-16 border-b border-gray-100 px-3 py-2 text-sm font-medium text-gray-500"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {weekDays.map((day, dayIndex) => {
          const dayFixtures = getFixturesForDay(day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={dayIndex}
              className={`relative border-l-2 border-gray-200 ${
                isToday ? 'bg-green-50/30' : ''
              }`}
            >
              {/* Hour Lines */}
              {TIME_SLOTS.map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  className="h-16 border-b border-gray-100"
                />
              ))}

              {/* Fixtures */}
              {dayFixtures.map((fixture) => {
                const top = getTimePosition(fixture.start_time);
                const height = getEventHeight(fixture.start_time, fixture.end_time);

                return (
                  <button
                    key={fixture.id}
                    data-testid={`calendar-fixture-${fixture.id}`}
                    onClick={() => onFixtureClick(fixture)}
                    className="absolute left-1 right-1 rounded-lg p-2 text-left overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                      backgroundColor: fixture.sport.color,
                      minHeight: '60px',
                    }}
                  >
                    <div className="text-white text-xs font-bold mb-0.5">
                      {formatDate(fixture.start_time, 'h:mm a')}
                    </div>
                    <div className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {fixture.title}
                    </div>
                    <div className="text-white text-xs opacity-90 line-clamp-1">
                      {fixture.home_team} vs {fixture.away_team}
                    </div>
                    <div className="text-white text-xs opacity-75 line-clamp-1">
                      {fixture.field}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
