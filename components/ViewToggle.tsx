'use client';

import { List, Calendar, CalendarDays } from 'lucide-react';

export type ViewMode = 'list' | 'week' | 'month';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  variant?: 'inline' | 'bottom-bar';
}

const views: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  { value: 'list', label: 'List', icon: <List className="w-5 h-5" /> },
  { value: 'week', label: 'Week', icon: <Calendar className="w-5 h-5" /> },
  { value: 'month', label: 'Month', icon: <CalendarDays className="w-5 h-5" /> },
];

export function ViewToggle({ view, onViewChange, variant = 'inline' }: ViewToggleProps) {
  // Inline variant (desktop header)
  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
        {views.map((v) => (
          <button
            key={v.value}
            data-testid={`view-toggle-${v.value}`}
            onClick={() => onViewChange(v.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              view === v.value
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" style={{ display: v.value === 'list' ? 'block' : 'none' }} />
            <Calendar className="w-4 h-4" style={{ display: v.value === 'week' ? 'block' : 'none' }} />
            <CalendarDays className="w-4 h-4" style={{ display: v.value === 'month' ? 'block' : 'none' }} />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Bottom bar variant (mobile)
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      data-testid="mobile-bottom-nav"
    >
      <div className="flex w-full">
        {views.map((v) => (
          <button
            key={v.value}
            data-testid={`view-toggle-mobile-${v.value}`}
            onClick={() => onViewChange(v.value)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all ${
              view === v.value
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              view === v.value
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                : ''
            }`}>
              {v.value === 'list' && <List className="w-5 h-5" />}
              {v.value === 'week' && <Calendar className="w-5 h-5" />}
              {v.value === 'month' && <CalendarDays className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-semibold ${
              view === v.value ? 'text-green-600' : 'text-gray-500'
            }`}>
              {v.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
