'use client';

import { FixtureWithSport } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatTime } from '@/lib/date-utils';
import { DayEventsSheet } from '@/components/DayEventsSheet';

interface MonthCalendarProps {
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
  initialDate?: Date;
}

export function MonthCalendar({ fixtures, onFixtureClick, initialDate = new Date() }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get all days in month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad to start on Monday
  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1;
  
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(null);
  };

  const getFixturesForDay = (day: Date) => {
    return fixtures.filter(fixture => isSameDay(new Date(fixture.start_time), day));
  };

  const handleDayClick = (day: Date) => {
    const dayFixtures = getFixturesForDay(day);
    if (isMobile) {
      // Mobile: Open bottom sheet
      setSelectedDay(day);
    } else {
      // Desktop: Open panel below or open first fixture modal
      if (dayFixtures.length === 1) {
        onFixtureClick(dayFixtures[0]);
      } else {
        setSelectedDay(isSameDay(day, selectedDay || new Date('1970-01-01')) ? null : day);
      }
    }
  };

  const dayFixtures = selectedDay && !isMobile ? getFixturesForDay(selectedDay) : [];

  return (
    <>
      <div className="glass-strong rounded-2xl shadow-xl overflow-hidden">
        {/* Month Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                data-testid="month-today-button"
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToPreviousMonth}
                data-testid="month-prev-button"
                className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goToNextMonth}
                data-testid="month-next-button"
                className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Padding days */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square" />
            ))}
            
            {/* Month days */}
            {daysInMonth.map((day) => {
              const dayFixtures = getFixturesForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay) && !isMobile;
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  data-testid={`month-day-${format(day, 'yyyy-MM-dd')}`}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square rounded-xl p-2 transition-all hover:shadow-md relative ${
                    isTodayDate
                      ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white font-bold'
                      : isSelected
                      ? 'bg-green-100 border-2 border-green-500'
                      : dayFixtures.length > 0
                      ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${isTodayDate ? 'text-white' : 'text-gray-900'}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Event Indicators */}
                  {dayFixtures.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                      {dayFixtures.slice(0, 3).map((fixture, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: fixture.sport.color }}
                        />
                      ))}
                      {dayFixtures.length > 3 && (
                        <span className="text-[10px] text-gray-600 font-medium">+{dayFixtures.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details - Desktop Only */}
        {selectedDay && !isMobile && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {format(selectedDay, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              {dayFixtures.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No fixtures scheduled</p>
              ) : (
                <div className="space-y-3">
                  {dayFixtures.map((fixture) => (
                    <button
                      key={fixture.id}
                      data-testid={`month-fixture-${fixture.id}`}
                      onClick={() => onFixtureClick(fixture)}
                      className="w-full text-left p-4 bg-white rounded-xl border-2 hover:shadow-md transition-all"
                      style={{
                        borderColor: `${fixture.sport.color}40`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="px-3 py-1 rounded-full text-white text-xs font-bold"
                          style={{ backgroundColor: fixture.sport.color }}
                        >
                          {fixture.sport.name}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {formatTime(fixture.start_time)}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{fixture.title}</h4>
                      <p className="text-sm text-gray-600">
                        {fixture.home_team} vs {fixture.away_team}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{fixture.field}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobile && (
        <DayEventsSheet
          date={selectedDay}
          fixtures={selectedDay ? getFixturesForDay(selectedDay) : []}
          onClose={() => setSelectedDay(null)}
          onFixtureClick={onFixtureClick}
        />
      )}
    </>
  );
}
