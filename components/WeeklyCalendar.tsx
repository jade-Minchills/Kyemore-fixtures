'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatDate, getTimePosition, getEventHeight } from '@/lib/date-utils';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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
  const [startDayIndex, setStartDayIndex] = useState(0);

  // Responsive day count based on screen size
  const getVisibleDays = () => {
    if (typeof window === 'undefined') return weekDays;
    
    const width = window.innerWidth;
    if (width < 640) {
      // Mobile: 1 day
      return [weekDays[startDayIndex]];
    } else if (width < 1024) {
      // Tablet: 3 days
      const start = Math.min(startDayIndex, weekDays.length - 3);
      return weekDays.slice(start, start + 3);
    }
    // Desktop: 7 days
    return weekDays;
  };

  const [visibleDays, setVisibleDays] = useState(getVisibleDays());

  const handleResize = () => {
    setVisibleDays(getVisibleDays());
  };

  useState(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  });

  const canGoBack = startDayIndex > 0;
  const canGoForward = typeof window !== 'undefined' && window.innerWidth < 640 
    ? startDayIndex < weekDays.length - 1
    : window.innerWidth < 1024
    ? startDayIndex < weekDays.length - 3
    : false;

  const handlePrevious = () => {
    if (canGoBack) {
      const newIndex = Math.max(0, startDayIndex - 1);
      setStartDayIndex(newIndex);
      setVisibleDays(getVisibleDays());
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      const width = window.innerWidth;
      const maxIndex = width < 640 ? weekDays.length - 1 : weekDays.length - 3;
      const newIndex = Math.min(maxIndex, startDayIndex + 1);
      setStartDayIndex(newIndex);
      setVisibleDays(getVisibleDays());
    }
  };

  const getFixturesForDay = (day: Date) => {
    return fixtures.filter(fixture => 
      isSameDay(new Date(fixture.start_time), day)
    );
  };

  const dayCount = visibleDays.length;

  return (
    <div className="glass-strong rounded-2xl shadow-xl overflow-hidden">
      {/* Navigation for mobile/tablet */}
      {dayCount < 7 && (
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack}
            className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {dayCount === 1 ? format(visibleDays[0], 'EEEE, MMMM d') : `${format(visibleDays[0], 'MMM d')} - ${format(visibleDays[dayCount - 1], 'MMM d')}`}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {/* Calendar Header */}
        <div className={`grid border-b-2 border-gray-200 min-w-max`} style={{ gridTemplateColumns: `80px repeat(${dayCount}, minmax(120px, 1fr))` }}>
          <div className="p-4 font-semibold text-gray-500 text-sm">Time</div>
          {visibleDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={index}
                data-testid={`calendar-day-${format(day, 'EEE').toLowerCase()}`}
                className={`p-4 text-center border-l-2 border-gray-200 ${
                  isToday ? 'bg-gradient-to-br from-green-50 to-teal-50' : ''
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
                  <div className="mt-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs rounded-full inline-block shadow-md">
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className={`grid relative min-w-max`} style={{ gridTemplateColumns: `80px repeat(${dayCount}, minmax(120px, 1fr))`, minHeight: '600px' }}>
          {/* Time Labels */}
          <div className="border-r-2 border-gray-200 bg-gray-50">
            {TIME_SLOTS.map((time, index) => (
              <div
                key={index}
                className="h-16 border-b border-gray-200 px-2 py-2 text-xs md:text-sm font-medium text-gray-500"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {visibleDays.map((day, dayIndex) => {
            const dayFixtures = getFixturesForDay(day);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={dayIndex}
                className={`relative border-l-2 border-gray-200 ${
                  isToday ? 'bg-gradient-to-br from-green-50/30 to-teal-50/30' : ''
                }`}
              >
                {/* Hour Lines */}
                {TIME_SLOTS.map((_, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="h-16 border-b border-gray-200"
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
                      className="absolute left-1 right-1 rounded-xl p-2 text-left overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:z-10 hover:scale-105"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
                        minHeight: '60px',
                      }}
                    >
                      <div className="text-white text-xs font-bold mb-0.5 line-clamp-1">
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
    </div>
  );
}

