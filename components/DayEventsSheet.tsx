'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { X, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DayEventsSheetProps {
  date: Date | null;
  fixtures: FixtureWithSport[];
  onClose: () => void;
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

export function DayEventsSheet({ date, fixtures, onClose, onFixtureClick }: DayEventsSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (date) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [date]);

  if (!date || !mounted) return null;

  const sortedFixtures = [...fixtures].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const content = (
    <div
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
        onClick={onClose}
        data-testid="day-events-backdrop"
      />

      {/* Bottom Sheet - above bottom nav on mobile */}
      <div
        style={{
          position: 'absolute',
          bottom: window.innerWidth < 768 ? '80px' : '50%',
          left: window.innerWidth < 768 ? 0 : '50%',
          right: window.innerWidth < 768 ? 0 : 'auto',
          transform: window.innerWidth < 768 ? 'none' : 'translate(-50%, 50%)',
          width: window.innerWidth < 768 ? '100%' : '90vw',
          maxWidth: window.innerWidth < 768 ? '100%' : '640px',
          maxHeight: window.innerWidth < 768 ? 'calc(100vh - 160px)' : '75vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: window.innerWidth < 768 ? 0 : '24px',
          borderBottomRightRadius: window.innerWidth < 768 ? 0 : '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
        data-testid="day-events-sheet"
      >
        {/* Handle - mobile only */}
        {window.innerWidth < 768 && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '8px', flexShrink: 0 }}>
            <div style={{ width: '48px', height: '6px', backgroundColor: '#D1D5DB', borderRadius: '9999px' }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #E5E7EB',
          flexShrink: 0,
          background: 'linear-gradient(to right, #ECFDF5, #F0FDFA)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {formatDate(date.toISOString(), 'EEEE, MMMM d')}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#4B5563' }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          {sortedFixtures.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <p style={{ fontSize: '16px', margin: 0 }}>No fixtures scheduled</p>
            </div>
          ) : (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedFixtures.map((fixture) => (
                <button
                  key={fixture.id}
                  onClick={() => {
                    onFixtureClick(fixture);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: '16px',
                    border: `2px solid ${fixture.sport.color}40`,
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Sport Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {fixture.sport.name}
                    </span>
                    {fixture.status !== 'scheduled' && (
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: fixture.status === 'postponed' ? '#FEF3C7' : '#FEE2E2',
                          color: fixture.status === 'postponed' ? '#92400E' : '#991B1B',
                        }}
                      >
                        {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }}>
                    {fixture.title}
                  </h3>

                  {/* Teams */}
                  <div style={{ fontSize: '16px', color: '#111827', marginBottom: '12px', fontWeight: 600 }}>
                    {fixture.home_team} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs</span> {fixture.away_team}
                  </div>

                  {/* Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                      <span style={{ fontWeight: 500 }}>{formatTime(fixture.start_time)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                      <span style={{ fontWeight: 500 }}>{fixture.field}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
