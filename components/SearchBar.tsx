'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search games, teams, or fields..."
        className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-md border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all shadow-md hover:shadow-lg text-gray-900 placeholder-gray-500"
      />
    </div>
  );
}