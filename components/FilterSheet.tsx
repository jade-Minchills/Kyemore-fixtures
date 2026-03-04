'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const [mounted, setMounted] = useState(false);

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
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

  // Bottom sheet content rendered via portal
  const sheetContent = isOpen ? (
    <div 
      className="md:hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => setIsOpen(false)}
        data-testid="filter-sheet-backdrop"
      />

      {/* Bottom Sheet - positioned above the bottom nav (80px) */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          right: 0,
          maxHeight: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          animation: 'filterSlideUp 0.3s ease-out',
        }}
        data-testid="filter-sheet"
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '8px', flexShrink: 0 }}>
          <div style={{ width: '48px', height: '6px', backgroundColor: '#D1D5DB', borderRadius: '9999px' }} />
        </div>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 24px',
          borderBottom: '1px solid #E5E7EB',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            data-testid="filter-sheet-close"
            style={{
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <X style={{ width: '24px', height: '24px', color: '#4B5563' }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Date Range */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Date Range
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    data-testid={`date-range-${option.value}`}
                    onClick={() => onDateRangeChange(option.value)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      background: dateRange === option.value
                        ? 'linear-gradient(to right, #10B981, #14B8A6)'
                        : '#F3F4F6',
                      color: dateRange === option.value ? 'white' : '#374151',
                      boxShadow: dateRange === option.value ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Field
              </label>
              <select
                data-testid="field-filter-select"
                value={selectedField}
                onChange={(e) => onFieldChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#111827',
                  outline: 'none',
                }}
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Time of Day
              </label>
              <select
                data-testid="time-of-day-filter-select"
                value={selectedTimeOfDay}
                onChange={(e) => onTimeOfDayChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#111827',
                  outline: 'none',
                }}
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Status
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    data-testid={`status-filter-${option.value}`}
                    onClick={() => toggleStatus(option.value)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedStatus.includes(option.value)
                        ? 'linear-gradient(to right, #10B981, #14B8A6)'
                        : '#F3F4F6',
                      color: selectedStatus.includes(option.value) ? 'white' : '#374151',
                      boxShadow: selectedStatus.includes(option.value) ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          flexShrink: 0, 
          padding: '24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          borderTop: '1px solid #E5E7EB',
          backgroundColor: 'white',
        }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(to right, #10B981, #14B8A6)',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes filterSlideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  ) : null;

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

      {/* Portal-rendered bottom sheet */}
      {mounted && sheetContent && createPortal(sheetContent, document.body)}
    </>
  );
}
