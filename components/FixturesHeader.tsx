'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SportFilter } from '@/components/SportFilter';
import { SearchBar } from '@/components/SearchBar';
import { ViewToggle, ViewMode } from '@/components/ViewToggle';
import { FilterSheet } from '@/components/FilterSheet';
import { Sport } from '@/lib/types';

interface FixturesHeaderProps {
  sports: Sport[];
  selectedSports: string[];
  onToggleSport: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  fields: string[];
  selectedField: string;
  onFieldChange: (field: string) => void;
  selectedTimeOfDay: string;
  onTimeOfDayChange: (time: string) => void;
  selectedStatus: string[];
  onStatusChange: (statuses: string[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function FixturesHeader({
  sports,
  selectedSports,
  onToggleSport,
  searchQuery,
  onSearchChange,
  view,
  onViewChange,
  fields,
  selectedField,
  onFieldChange,
  selectedTimeOfDay,
  onTimeOfDayChange,
  selectedStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}: FixturesHeaderProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsCompact(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`glass-strong border-b-2 border-gray-200/50 sticky top-0 z-40 shadow-md transition-all duration-300 ${
        isCompact ? 'py-3' : 'py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo + Title Row */}
        <div className={`flex items-center gap-3 md:gap-4 transition-all duration-300 ${isCompact ? 'mb-3' : 'mb-4 md:mb-6'}`}>
          <Image
            src="/logo.png"
            alt="Kylemore RFC Logo"
            width={isCompact ? 32 : 40}
            height={isCompact ? 32 : 40}
            className="flex-shrink-0 transition-all duration-300"
            priority
          />
          <div className="flex-1 min-w-0">
            <h1
              className={`font-bold text-gray-900 transition-all duration-300 ${
                isCompact
                  ? 'text-lg sm:text-xl md:text-2xl'
                  : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
              }`}
            >
              Kylemore Sports Ground Fixtures
            </h1>
            {!isCompact && (
              <p className="text-sm md:text-lg text-gray-600 transition-opacity duration-300">
                See what games are happening
              </p>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2 mb-4">
          <ViewToggle view={view} onViewChange={onViewChange} />
          <div className="md:hidden">
            <FilterSheet
              fields={fields}
              selectedField={selectedField}
              onFieldChange={onFieldChange}
              selectedTimeOfDay={selectedTimeOfDay}
              onTimeOfDayChange={onTimeOfDayChange}
              selectedStatus={selectedStatus}
              onStatusChange={onStatusChange}
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>

        {/* Sport Filters - Only show if not compact or always on desktop */}
        {(!isCompact || window.innerWidth >= 768) && (
          <div className="mb-4">
            <SportFilter
              sports={sports}
              selectedSports={selectedSports}
              onToggleSport={onToggleSport}
            />
          </div>
        )}

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
    </div>
  );
}
