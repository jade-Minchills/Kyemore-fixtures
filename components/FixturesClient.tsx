'use client';

import { useState, useMemo } from 'react';
import { Sport, FixtureWithSport } from '@/lib/types';
import { getWeekDays, getCurrentWeekRange } from '@/lib/date-utils';
import { SportFilter } from '@/components/SportFilter';
import { SearchBar } from '@/components/SearchBar';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { UpcomingFixtures } from '@/components/UpcomingFixtures';
import { FixtureModal } from '@/components/FixtureModal';
import { Filters } from '@/components/Filters';
import { addWeeks, addDays, startOfMonth, endOfMonth } from 'date-fns';

interface FixturesClientProps {
  sports: Sport[];
  fixtures: FixtureWithSport[];
}

export function FixturesClient({ sports, fixtures }: FixturesClientProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFixture, setSelectedFixture] = useState<FixtureWithSport | null>(null);
  const [dateRange, setDateRange] = useState('this-week');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['scheduled']);

  // Get date range based on selection
  const { start: weekStart, end: weekEnd } = useMemo(() => {
    const today = new Date();
    if (dateRange === 'next-week') {
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

  // Get unique fields
  const fields = useMemo(() => {
    const fieldSet = new Set<string>();
    fixtures.forEach(f => {
      if (f.field) fieldSet.add(f.field);
    });
    return Array.from(fieldSet).sort();
  }, [fixtures]);

  // Filter fixtures
  const filteredFixtures = useMemo(() => {
    return fixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.start_time);
      const fixtureHour = fixtureDate.getHours();

      // Date range filter
      if (fixtureDate < weekStart || fixtureDate > addDays(weekEnd, 1)) {
        return false;
      }

      // Sport filter
      if (selectedSports.length > 0 && !selectedSports.includes(fixture.sport.slug)) {
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

      // Field filter
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
  }, [fixtures, selectedSports, searchQuery, weekStart, weekEnd, selectedField, selectedTimeOfDay, selectedStatus]);

  const handleToggleSport = (slug: string) => {
    if (selectedSports.includes(slug)) {
      setSelectedSports(selectedSports.filter(s => s !== slug));
    } else {
      setSelectedSports([...selectedSports, slug]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              Kylemore Sports Ground Fixtures
            </h1>
            <p className="text-lg text-gray-600">
              See what games are happening this week
            </p>
          </div>

          {/* Sport Filters */}
          <div className="mb-4">
            <SportFilter
              sports={sports}
              selectedSports={selectedSports}
              onToggleSport={handleToggleSport}
            />
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Calendar + Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
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

            {/* Calendar */}
            {dateRange !== 'this-month' ? (
              <WeeklyCalendar
                weekDays={weekDays}
                fixtures={filteredFixtures}
                onFixtureClick={setSelectedFixture}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly View</h3>
                <div className="space-y-3">
                  {filteredFixtures
                    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                    .map(fixture => (
                      <button
                        key={fixture.id}
                        data-testid={`list-fixture-${fixture.id}`}
                        onClick={() => setSelectedFixture(fixture)}
                        className="w-full text-left p-4 rounded-lg border-2 hover:shadow-md transition-all"
                        style={{
                          borderColor: fixture.sport.color,
                          backgroundColor: `${fixture.sport.color}10`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-lg text-gray-900 mb-1">{fixture.title}</div>
                            <div className="text-gray-700">
                              {fixture.home_team} vs {fixture.away_team}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              {new Date(fixture.start_time).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })} • {fixture.field}
                            </div>
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-white text-sm font-medium"
                            style={{ backgroundColor: fixture.sport.color }}
                          >
                            {fixture.sport.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  {filteredFixtures.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No fixtures found for this month
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Upcoming Fixtures */}
          <div className="lg:col-span-1">
            <UpcomingFixtures
              fixtures={filteredFixtures}
              onFixtureClick={setSelectedFixture}
            />
          </div>
        </div>
      </div>

      {/* Fixture Modal */}
      <FixtureModal fixture={selectedFixture} onClose={() => setSelectedFixture(null)} />
    </div>
  );
}
