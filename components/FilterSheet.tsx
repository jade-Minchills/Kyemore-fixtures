'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterSheetProps {
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

export function FilterSheet({
  fields,
  selectedField,
  onFieldChange,
  selectedTimeOfDay,
  onTimeOfDayChange,
  selectedStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}: FilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  const activeFiltersCount = [
    selectedField !== 'all' ? 1 : 0,
    selectedTimeOfDay !== 'all' ? 1 : 0,
    selectedStatus.length < STATUS_OPTIONS.length ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        data-testid="filter-sheet-trigger"
        className="relative flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all font-medium text-gray-700"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            data-testid="filter-sheet-backdrop"
          />

          {/* Sheet Container */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col bg-white rounded-t-3xl shadow-2xl animate-slide-up"
            style={{ maxHeight: '85dvh' }}
            data-testid="filter-sheet"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                data-testid="filter-sheet-close"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-6 space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Date Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        data-testid={`date-range-${option.value}`}
                        onClick={() => onDateRangeChange(option.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          dateRange === option.value
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Field
                  </label>
                  <select
                    data-testid="field-filter-select"
                    value={selectedField}
                    onChange={(e) => onFieldChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white text-gray-900"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Time of Day
                  </label>
                  <select
                    data-testid="time-of-day-filter-select"
                    value={selectedTimeOfDay}
                    onChange={(e) => onTimeOfDayChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white text-gray-900"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        data-testid={`status-filter-${option.value}`}
                        onClick={() => toggleStatus(option.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedStatus.includes(option.value)
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
