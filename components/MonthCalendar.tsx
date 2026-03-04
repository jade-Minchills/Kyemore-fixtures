'use client';

import { FixtureWithSport } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DayEventsSheet } from '@/components/DayEventsSheet';

interface MonthCalendarProps {
  fixtures: FixtureWithSport[];
  onFixtureClick: (fixture: FixtureWithSport) => void;
  initialDate?: Date;
}

export function MonthCalendar({ fixtures, onFixtureClick, initialDate = new Date() }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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
    if (dayFixtures.length > 0) {
      // Always open popup/sheet for consistency
      setSelectedDay(day);
    }
  };

  return (
    <>
      <div className="glass-strong rounded-2xl shadow-xl overflow-hidden">
        {/* Month Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                data-testid="month-today-button"
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToPreviousMonth}
                data-testid="month-prev-button"
                className="p-1.5 md:p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </button>
              <button
                onClick={goToNextMonth}
                data-testid="month-next-button"
                className="p-1.5 md:p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 md:p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-[10px] md:text-xs font-semibold text-gray-500 uppercase py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {/* Padding days */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square" />
            ))}
            
            {/* Month days */}
            {daysInMonth.map((day) => {
              const dayFixtures = getFixturesForDay(day);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  data-testid={`month-day-${format(day, 'yyyy-MM-dd')}`}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square rounded-lg md:rounded-xl p-1 md:p-2 transition-all hover:shadow-md relative ${
                    isTodayDate
                      ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white font-bold ring-2 ring-green-600'
                      : dayFixtures.length > 0
                      ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-xs md:text-sm font-medium ${isTodayDate ? 'text-white' : 'text-gray-900'}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Event Indicators */}
                  {dayFixtures.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-0.5 md:mt-1 justify-center">
                      {dayFixtures.slice(0, 3).map((fixture, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                          style={{ backgroundColor: fixture.sport.color }}
                        />
                      ))}
                      {dayFixtures.length > 3 && (
                        <span className="text-[8px] md:text-[10px] text-gray-600 font-medium">+{dayFixtures.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Always use popup/sheet - no panel below calendar */}
      <DayEventsSheet
        date={selectedDay}
        fixtures={selectedDay ? getFixturesForDay(selectedDay) : []}
        onClose={() => setSelectedDay(null)}
        onFixtureClick={onFixtureClick}
      />
    </>
  );
}
