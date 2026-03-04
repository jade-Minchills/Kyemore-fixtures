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
    <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-3 min-w-max md:flex-wrap">
        {sports.map((sport) => {
          const isSelected = selectedSports.includes(sport.slug);
          return (
            <button
              key={sport.id}
              onClick={() => onToggleSport(sport.slug)}
              data-testid={`sport-filter-${sport.slug}`}
              className="px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${sport.color} 0%, ${sport.color}dd 100%)`
                  : 'rgba(255, 255, 255, 0.95)',
                color: isSelected ? 'white' : '#374151',
                border: `2px solid ${isSelected ? sport.color : '#E5E7EB'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {isSelected && <Check className="w-4 h-4" />}
              {sport.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}