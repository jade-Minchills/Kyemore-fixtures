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
    <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-3 min-w-max md:flex-wrap">
        {STANDARD_FIELDS.map((field) => {
          const isSelected = selectedFields.includes(field.name);
          return (
            <button
              key={field.id}
              onClick={() => onToggleField(field.name)}
              data-testid={`field-filter-${field.id}`}
              className="px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${field.color} 0%, ${field.color}dd 100%)`
                  : 'rgba(255, 255, 255, 0.95)',
                color: isSelected ? 'white' : '#374151',
                border: `2px solid ${isSelected ? field.color : '#E5E7EB'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {isSelected && <Check className="w-4 h-4" />}
              {field.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
