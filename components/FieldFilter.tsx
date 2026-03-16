'use client';

import { Check } from 'lucide-react';

// Standard field names used across the app
export const STANDARD_FIELDS = [
  { id: 'rugby-field', name: 'Rugby Field', color: '#10B981' },
  { id: 'soccer-field', name: 'Soccer Field', color: '#F59E0B' },
  { id: 'clubhouse', name: 'Clubhouse', color: '#8B5CF6' },
];

interface FieldFilterProps {
  selectedFields: string[];
  onToggleField: (fieldName: string) => void;
}

export function FieldFilter({ selectedFields, onToggleField }: FieldFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STANDARD_FIELDS.map((field) => {
          const isSelected = selectedFields.includes(field.name);
          return (
            <button
              key={field.id}
              onClick={() => onToggleField(field.name)}
              data-testid={`field-filter-${field.id}`}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${field.color} 0%, ${field.color}dd 100%)`
                  : 'rgba(255, 255, 255, 0.95)',
                color: isSelected ? 'white' : '#374151',
                border: `2px solid ${isSelected ? field.color : '#E5E7EB'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {field.name}
            </button>
          );
        })}
    </div>
  );
}
