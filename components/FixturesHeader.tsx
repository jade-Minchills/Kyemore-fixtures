'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FieldFilter } from '@/components/FieldFilter';
import { SearchBar } from '@/components/SearchBar';
import { ViewToggle, ViewMode } from '@/components/ViewToggle';
import { FilterSheet } from '@/components/FilterSheet';
import { Sport } from '@/lib/types';

interface FixturesHeaderProps {
  sports: Sport[];
  selectedSports: string[];
  onToggleSport: (slug: string) => void;
  selectedFields: string[];
  onToggleField: (fieldName: string) => void;
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
  selectedFields,
  onToggleField,
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
      const scrolled = window.scrollY > 80;
      setIsCompact(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`glass-strong border-b-2 border-gray-200/50 sticky top-0 z-40 shadow-md transition-all duration-300 ease-in-out ${
        isCompact ? 'py-2' : 'py-3 md:py-4'
      }`}
      style={{ 
        minHeight: isCompact ? '60px' : undefined,
        willChange: 'height, padding'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Logo + Title + Controls Row */}
        <div className={`flex items-center gap-2 md:gap-3 transition-all duration-300 ${isCompact ? 'mb-2' : 'mb-3'}`}>
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Kylemore RFC Logo"
            width={isCompact ? 28 : 36}
            height={isCompact ? 28 : 36}
            className="flex-shrink-0 transition-all duration-300"
            priority
          />
          
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1
              className={`font-bold text-gray-900 leading-tight transition-all duration-300 ${
                isCompact
                  ? 'text-sm sm:text-base md:text-lg'
                  : 'text-base sm:text-lg md:text-xl lg:text-2xl'
              }`}
            >
              Kylemore Sports Ground Fixtures
            </h1>
          </div>

          {/* View Toggle + Filter Button - Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* ViewToggle - Hidden on mobile, shown on tablet/desktop */}
            <div className="hidden md:block">
              <ViewToggle view={view} onViewChange={onViewChange} />
            </div>
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
        </div>

        {/* Sport Filters + Search Row - Compact horizontal layout */}
        {!isCompact && (
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 transition-opacity duration-300">
            {/* Sport Filters */}
            <div className="flex-shrink-0">
              <SportFilter
                sports={sports}
                selectedSports={selectedSports}
                onToggleSport={onToggleSport}
              />
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 min-w-0 sm:max-w-md">
              <SearchBar value={searchQuery} onChange={onSearchChange} />
            </div>
          </div>
        )}

        {/* Compact Mode - Only Search */}
        {isCompact && (
          <div className="transition-opacity duration-300">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>
        )}
      </div>
    </div>
  );
}
