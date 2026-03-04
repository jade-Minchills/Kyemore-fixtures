'use client';

import { FixtureWithSport } from '@/lib/types';
import { X, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { formatTime, formatDate } from '@/lib/date-utils';

interface FixtureModalProps {
  fixture: FixtureWithSport | null;
  onClose: () => void;
}

export function FixtureModal({ fixture, onClose }: FixtureModalProps) {
  if (!fixture) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="fixture-modal-overlay"
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="fixture-modal"
      >
        {/* Header */}
        <div 
          className="p-6 text-white rounded-t-2xl relative"
          style={{ backgroundColor: fixture.sport.color }}
        >
          <button
            onClick={onClose}
            data-testid="close-modal-button"
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="pr-12">
            <div className="text-sm font-semibold mb-2 opacity-90">{fixture.sport.name}</div>
            <h2 className="text-3xl font-bold mb-2">{fixture.title}</h2>
            <div className="flex items-center gap-2 text-lg">
              <span className="font-semibold">{fixture.home_team}</span>
              <span className="opacity-75">vs</span>
              <span className="font-semibold">{fixture.away_team}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 font-medium">Date</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(fixture.start_time, 'EEEE, MMMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 font-medium">Time</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatTime(fixture.start_time)} - {formatTime(fixture.end_time)}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 font-medium">Location</div>
              <div className="text-lg font-semibold text-gray-900">{fixture.location_name}</div>
              {fixture.field && (
                <div className="text-sm text-gray-600 mt-1">{fixture.field}</div>
              )}
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600 font-medium mb-2">Teams</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Home</div>
                  <div className="font-semibold text-gray-900">{fixture.home_team}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Away</div>
                  <div className="font-semibold text-gray-900">{fixture.away_team}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-5 h-5 mt-0.5">
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: 
                    fixture.status === 'scheduled' ? '#10B981' :
                    fixture.status === 'postponed' ? '#F59E0B' : '#EF4444'
                }}
              />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium">Status</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {fixture.status}
              </div>
            </div>
          </div>

          {/* Notes */}
          {fixture.notes && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 font-medium mb-1">Notes</div>
                <div className="text-gray-900">{fixture.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}