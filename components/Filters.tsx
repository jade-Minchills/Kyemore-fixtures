'use client';

import { Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FiltersProps {
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

const TIME_OF_DAY_OPTIONS = [
  { value: 'all', label: 'All Day' },
  { value: 'morning', label: 'Morning (8AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { value: 'evening', label: 'Evening (5PM-8PM)' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'this-week', label: 'This Week' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'this-month', label: 'This Month' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'postponed', label: 'Postponed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function Filters({
  fields,
  selectedField,
  onFieldChange,
  selectedTimeOfDay,
  onTimeOfDayChange,
  selectedStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(true);

  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4 hover:text-green-600 transition-colors"
        data-testid="toggle-filters-button"
      >
        <Filter className="w-5 h-5" />
        Filters
        <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  data-testid={`date-range-${option.value}`}
                  onClick={() => onDateRangeChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === option.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Field Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field
            </label>
            <select
              data-testid="field-filter-select"
              value={selectedField}
              onChange={(e) => onFieldChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="all">All Fields</option>
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time of Day
            </label>
            <select
              data-testid="time-of-day-filter-select"
              value={selectedTimeOfDay}
              onChange={(e) => onTimeOfDayChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            >
              {TIME_OF_DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  data-testid={`status-filter-${option.value}`}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus.includes(option.value)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
