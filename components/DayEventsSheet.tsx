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
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

      {/* Bottom Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '80px' : '50%',
          left: isMobile ? 0 : '50%',
          right: isMobile ? 0 : 'auto',
          transform: isMobile ? 'none' : 'translate(-50%, 50%)',
          width: isMobile ? '100%' : '90vw',
          maxWidth: isMobile ? '100%' : '640px',
          maxHeight: isMobile ? 'calc(100vh - 160px)' : '75vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: isMobile ? 0 : '24px',
          borderBottomRightRadius: isMobile ? 0 : '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
        data-testid="day-events-sheet"
      >
        {/* Handle - mobile only */}
        {isMobile && (
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
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                    {fixture.title}
                  </h3>
                  {fixture.competition && (
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{fixture.competition}</span>
                      {fixture.round && <span>· {fixture.round}</span>}
                      {fixture.is_home !== null && fixture.is_home !== undefined && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: fixture.is_home ? '#ECFDF5' : '#EFF6FF',
                          color: fixture.is_home ? '#065F46' : '#1E40AF',
                        }}>
                          {fixture.is_home ? 'Home' : 'Away'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Teams - Only show for sports matches, not events */}
                  {fixture.sport.slug !== 'events' && fixture.home_team && fixture.away_team && (
                    <div style={{ fontSize: '16px', color: '#111827', marginBottom: '12px', fontWeight: 600 }}>
                      {fixture.home_team} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs</span> {fixture.away_team}
                    </div>
                  )}

                  {/* Description for Events */}
                  {fixture.sport.slug === 'events' && fixture.notes && (
                    <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '12px', lineHeight: 1.5 }}>
                      {fixture.notes}
                    </p>
                  )}

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
