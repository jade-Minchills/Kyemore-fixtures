'use client';

import { Sport } from '@/lib/types';
import { Check } from 'lucide-react';

interface SportFilterProps {
  sports: Sport[];
  selectedSports: string[];
  onToggleSport: (slug: string) => void;
}

export function SportFilter({ sports, selectedSports, onToggleSport }: SportFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {sports.map((sport) => {
        const isSelected = selectedSports.includes(sport.slug);
        return (
          <button
            key={sport.id}
            onClick={() => onToggleSport(sport.slug)}
            data-testid={`sport-filter-${sport.slug}`}
            className="px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2"
            style={{
              backgroundColor: isSelected ? sport.color : 'white',
              color: isSelected ? 'white' : '#374151',
              border: `2px solid ${isSelected ? sport.color : '#E5E7EB'}`,
            }}
          >
            {isSelected && <Check className="w-4 h-4" />}
            {sport.name}
          </button>
        );
      })}
    </div>
  );
}