'use client';

import { List, Calendar, CalendarDays } from 'lucide-react';

export type ViewMode = 'list' | 'week' | 'month';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const views: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: 'list', label: 'List', icon: <List className="w-4 h-4" /> },
    { value: 'week', label: 'Week', icon: <Calendar className="w-4 h-4" /> },
    { value: 'month', label: 'Month', icon: <CalendarDays className="w-4 h-4" /> },
  ];

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
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
