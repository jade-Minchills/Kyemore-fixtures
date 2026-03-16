'use client';

import { useState, useMemo } from 'react';
import { Sport, FixtureWithSport } from '@/lib/types';
import { getWeekDays, getCurrentWeekRange } from '@/lib/date-utils';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { UpcomingFixtures } from '@/components/UpcomingFixtures';
import { FixtureModal } from '@/components/FixtureModal';
import { Filters } from '@/components/Filters';
import { ViewMode, ViewToggle } from '@/components/ViewToggle';
import { ListView } from '@/components/ListView';
import { MonthCalendar } from '@/components/MonthCalendar';
import { FixturesHeader } from '@/components/FixturesHeader';
import { STANDARD_FIELDS } from '@/components/FieldFilter';
import { addWeeks, addDays, startOfMonth, endOfMonth, subYears, addYears } from 'date-fns';

interface FixturesClientProps {
  sports: Sport[];
  fixtures: FixtureWithSport[];
}

export function FixturesClient({ sports, fixtures }: FixturesClientProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]); // Top field filter chips
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFixture, setSelectedFixture] = useState<FixtureWithSport | null>(null);
  const [dateRange, setDateRange] = useState('all-time'); // Default to All Time
  const [selectedField, setSelectedField] = useState('all'); // Dropdown filter
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['scheduled']);
  const [view, setView] = useState<ViewMode>('list'); // Default to list for mobile-first

  // Get date range based on selection
  const { start: weekStart, end: weekEnd } = useMemo(() => {
    const today = new Date();
    if (dateRange === 'all-time') {
      // Return a very wide range for "All Time"
      return {
        start: subYears(today, 10),
        end: addYears(today, 10),
      };
    } else if (dateRange === 'next-week') {
      const nextWeek = addWeeks(today, 1);
      return getCurrentWeekRange(nextWeek);
    } else if (dateRange === 'this-month') {
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    }
    return getCurrentWeekRange(today);
  }, [dateRange]);

  const weekDays = getWeekDays(weekStart);

  // Get unique fields from fixtures (for dropdown) - use standard field names
  const fields = useMemo(() => {
    return STANDARD_FIELDS.map(f => f.name);
  }, []);

  // Filter fixtures
  const filteredFixtures = useMemo(() => {
    return fixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.start_time);
      const fixtureHour = fixtureDate.getHours();

      // Date range filter (skip for all-time)
      if (dateRange !== 'all-time') {
        if (fixtureDate < weekStart || fixtureDate > addDays(weekEnd, 1)) {
          return false;
        }
      }

      // Sport filter (if any sports selected in sidebar/other filters)
      if (selectedSports.length > 0 && !selectedSports.includes(fixture.sport.slug)) {
        return false;
      }

      // Top field filter chips
      if (selectedFields.length > 0 && !selectedFields.includes(fixture.field || '')) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          fixture.title.toLowerCase().includes(query) ||
          fixture.home_team?.toLowerCase().includes(query) ||
          fixture.away_team?.toLowerCase().includes(query) ||
          fixture.field?.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Field dropdown filter
      if (selectedField !== 'all' && fixture.field !== selectedField) {
        return false;
      }

      // Time of day filter
      if (selectedTimeOfDay !== 'all') {
        if (selectedTimeOfDay === 'morning' && (fixtureHour < 8 || fixtureHour >= 12)) {
          return false;
        }
        if (selectedTimeOfDay === 'afternoon' && (fixtureHour < 12 || fixtureHour >= 17)) {
          return false;
        }
        if (selectedTimeOfDay === 'evening' && (fixtureHour < 17 || fixtureHour >= 20)) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus.length > 0 && !selectedStatus.includes(fixture.status)) {
        return false;
      }

      return true;
    });
  }, [fixtures, selectedSports, selectedFields, searchQuery, weekStart, weekEnd, dateRange, selectedField, selectedTimeOfDay, selectedStatus]);

  const handleToggleSport = (slug: string) => {
    if (selectedSports.includes(slug)) {
      setSelectedSports(selectedSports.filter(s => s !== slug));
    } else {
      setSelectedSports([...selectedSports, slug]);
    }
  };

  const handleToggleField = (fieldName: string) => {
    if (selectedFields.includes(fieldName)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldName));
    } else {
      setSelectedFields([...selectedFields, fieldName]);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with Logo and Controls */}
      <FixturesHeader
        sports={sports}
        selectedSports={selectedSports}
        onToggleSport={handleToggleSport}
        selectedFields={selectedFields}
        onToggleField={handleToggleField}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        view={view}
        onViewChange={setView}
        fields={fields}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        selectedTimeOfDay={selectedTimeOfDay}
        onTimeOfDayChange={setSelectedTimeOfDay}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Main Content - Add bottom padding on mobile for bottom nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Desktop Filters */}
            <div className="hidden md:block">
              <Filters
                fields={fields}
                selectedField={selectedField}
                onFieldChange={setSelectedField}
                selectedTimeOfDay={selectedTimeOfDay}
                onTimeOfDayChange={setSelectedTimeOfDay}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>

            {/* View Content */}
            {view === 'list' && (
              <ListView
                fixtures={filteredFixtures}
                onFixtureClick={setSelectedFixture}
              />
            )}

            {view === 'week' && (
              <div className="overflow-x-auto">
                <WeeklyCalendar
                  weekDays={weekDays}
                  fixtures={filteredFixtures}
                  onFixtureClick={setSelectedFixture}
                />
              </div>
            )}

            {view === 'month' && (
              <MonthCalendar
                fixtures={filteredFixtures}
                onFixtureClick={setSelectedFixture}
                initialDate={weekStart}
              />
            )}
          </div>

          {/* Right Column: Upcoming Fixtures - Hidden on mobile when in list view */}
          <div className={`lg:col-span-1 ${view === 'list' ? 'hidden lg:block' : 'hidden lg:block'}`}>
            <UpcomingFixtures
              fixtures={filteredFixtures}
              onFixtureClick={setSelectedFixture}
            />
          </div>
        </div>
      </div>

      {/* Fixture Modal */}
      <FixtureModal fixture={selectedFixture} onClose={() => setSelectedFixture(null)} />

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden">
        <ViewToggle view={view} onViewChange={setView} variant="bottom-bar" />
      </div>
    </div>
  );
}
