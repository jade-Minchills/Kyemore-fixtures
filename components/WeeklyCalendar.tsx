'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatDate, getTimePosition, getEventHeight } from '@/lib/date-utils';
import { format, isSameDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WeeklyCalendarProps {
  weekDays: Date[];
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

const TIME_SLOTS = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', 
  '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

export function WeeklyCalendar({ weekDays, fixtures, onFixtureClick }: WeeklyCalendarProps) {
  const today = new Date();
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [visibleDayCount, setVisibleDayCount] = useState(7);

  useEffect(() => {
    const updateVisibleDays = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleDayCount(1); // Mobile: 1 day
      } else if (width < 1024) {
        setVisibleDayCount(3); // Tablet: 3 days
      } else {
        setVisibleDayCount(7); // Desktop: 7 days
      }
    };

    updateVisibleDays();
    window.addEventListener('resize', updateVisibleDays);
    return () => window.removeEventListener('resize', updateVisibleDays);
  }, []);

  const visibleDays = weekDays.slice(startDayIndex, startDayIndex + visibleDayCount);
  
  const canGoBack = startDayIndex > 0;
  const canGoForward = startDayIndex + visibleDayCount < weekDays.length;

  const handlePrevious = () => {
    if (canGoBack) {
      setStartDayIndex(Math.max(0, startDayIndex - 1));
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setStartDayIndex(Math.min(weekDays.length - visibleDayCount, startDayIndex + 1));
    }
  };

  const getFixturesForDay = (day: Date) => {
    // Force refresh of fixtures by recreating the filter
    return fixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.start_time);
      return isSameDay(fixtureDate, day);
    });
  };

  return (
    <div className="glass-strong rounded-2xl shadow-xl overflow-hidden">
      {/* Navigation for mobile/tablet */}
      {visibleDayCount < 7 && (
        <div className="flex items-center justify-between p-3 md:p-4 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack}
            className="p-1.5 md:p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
          <div className="text-center">
            <div className="text-sm md:text-base font-semibold text-gray-700">
              {visibleDayCount === 1 
                ? format(visibleDays[0], 'EEEE, MMMM d') 
                : `${format(visibleDays[0], 'MMM d')} - ${format(visibleDays[visibleDayCount - 1], 'MMM d')}`}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className="p-1.5 md:p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {/* Calendar Header */}
        <div 
          className="grid border-b-2 border-gray-200 min-w-max bg-gray-50" 
          style={{ gridTemplateColumns: `80px repeat(${visibleDays.length}, minmax(120px, 1fr))` }}
        >
          <div className="p-2 md:p-4 font-semibold text-gray-500 text-xs md:text-sm">Time</div>
          {visibleDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={`${day.toISOString()}-${index}`}
                data-testid={`calendar-day-${format(day, 'EEE').toLowerCase()}`}
                className={`p-2 md:p-4 text-center border-l-2 border-gray-200 ${
                  isToday ? 'bg-gradient-to-br from-green-50 to-teal-50' : ''
                }`}
              >
                <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-xl md:text-2xl font-bold mt-1 ${
                    isToday ? 'text-green-600' : 'text-gray-800'
                  }`}
                >
                  {format(day, 'd')}
                </div>
                {isToday && (
                  <div className="mt-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-[10px] md:text-xs rounded-full inline-block shadow-md">
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Grid - Extended to 11 PM */}
        <div 
          className="grid relative min-w-max" 
          style={{ 
            gridTemplateColumns: `80px repeat(${visibleDays.length}, minmax(120px, 1fr))`,
            minHeight: '960px' // Increased for 16 hour slots (8 AM to 11 PM)
          }}
        >
          {/* Time Labels */}
          <div className="border-r-2 border-gray-200 bg-gray-50">
            {TIME_SLOTS.map((time, index) => (
              <div
                key={index}
                className="h-[60px] border-b border-gray-200 px-2 py-2 text-[10px] md:text-sm font-medium text-gray-500"
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
                key={`${day.toISOString()}-col-${dayIndex}`}
                className={`relative border-l-2 border-gray-200 ${
                  isToday ? 'bg-gradient-to-br from-green-50/30 to-teal-50/30' : ''
                }`}
              >
                {/* Hour Lines */}
                {TIME_SLOTS.map((_, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="h-[60px] border-b border-gray-200"
                  />
                ))}

                {/* Fixtures */}
                {dayFixtures.map((fixture) => {
                  const top = getTimePosition(fixture.start_time, 8);
                  const height = getEventHeight(fixture.start_time, fixture.end_time);

                  return (
                    <button
                      key={fixture.id}
                      data-testid={`calendar-fixture-${fixture.id}`}
                      onClick={() => onFixtureClick(fixture)}
                      className="absolute left-1 right-1 rounded-xl p-2 text-left overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:z-10 hover:scale-105"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 8)}%`,
                        background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
                        minHeight: '60px',
                      }}
                    >
                      <div className="text-white text-[10px] md:text-xs font-bold mb-0.5 line-clamp-1">
                        {formatDate(fixture.start_time, 'h:mm a')}
                      </div>
                      <div className="text-white font-semibold text-xs md:text-sm mb-1 line-clamp-1">
                        {fixture.title}
                      </div>
                      <div className="text-white text-[10px] md:text-xs opacity-90 line-clamp-1">
                        {fixture.home_team} vs {fixture.away_team}
                      </div>
                      <div className="text-white text-[10px] md:text-xs opacity-75 line-clamp-1">
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

