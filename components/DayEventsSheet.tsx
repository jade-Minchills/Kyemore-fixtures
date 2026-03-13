'use client';

import { FixtureWithSport } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/date-utils';
import { X, Clock, MapPin } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DayEventsSheetProps {
  date: Date | null;
  fixtures: FixtureWithSport[];
  onClose: () => void;
  onFixtureClick: (fixture: FixtureWithSport) => void;
}

export function DayEventsSheet({ date, fixtures, onClose, onFixtureClick }: DayEventsSheetProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [desktopPosition, setDesktopPosition] = useState<{ left?: string; right?: string; transform: string }>({
    left: '50%',
    transform: 'translate(-50%, -50%)'
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (date) {
      document.body.style.overflow = 'hidden';
      
      // Desktop positioning logic
      if (contentRef.current && !isMobile) {
        requestAnimationFrame(() => {
          const content = contentRef.current;
          if (!content) return;
          
          const rect = content.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          
          if (rect.left < 10) {
            setDesktopPosition({ left: '10px', right: undefined, transform: 'translate(0, -50%)' });
          } else if (rect.right > viewportWidth - 10) {
            setDesktopPosition({ left: undefined, right: '10px', transform: 'translate(0, -50%)' });
          } else {
            setDesktopPosition({ left: '50%', right: undefined, transform: 'translate(-50%, -50%)' });
          }
        });
      }
    } else {
      document.body.style.overflow = '';
      setDesktopPosition({ left: '50%', right: undefined, transform: 'translate(-50%, -50%)' });
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [date, isMobile]);

  if (!date) return null;

  const sortedFixtures = [...fixtures].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Mobile bottom sheet content
  const mobileContent = (
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

      {/* Bottom Sheet - positioned above bottom nav (80px) */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          right: 0,
          maxHeight: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          animation: 'dayEventsSlideUp 0.3s ease-out',
        }}
        data-testid="day-events-sheet"
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '8px', flexShrink: 0 }}>
          <div style={{ width: '48px', height: '6px', backgroundColor: '#D1D5DB', borderRadius: '9999px' }} />
        </div>

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
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
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
              <p style={{ fontSize: '16px' }}>No fixtures scheduled</p>
            </div>
          ) : (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
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
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
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

      <style>{`
        @keyframes dayEventsSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  // Desktop modal content (unchanged styling)
  const desktopContent = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="day-events-backdrop"
      />

      {/* Card Container */}
      <div
        ref={contentRef}
        data-testid="day-events-sheet"
        className="absolute rounded-2xl animate-fade-in w-[90vw] max-w-2xl flex flex-col bg-white shadow-2xl"
        style={{
          maxHeight: '75dvh',
          top: '50%',
          left: desktopPosition.left,
          right: desktopPosition.right,
          transform: desktopPosition.transform,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {formatDate(date.toISOString(), 'EEEE, MMMM d')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {sortedFixtures.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-lg">No fixtures scheduled</p>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {sortedFixtures.map((fixture) => (
                <button
                  key={fixture.id}
                  onClick={() => {
                    onFixtureClick(fixture);
                    onClose();
                  }}
                  className="w-full text-left glass-strong rounded-2xl shadow-lg hover:shadow-xl transition-all p-5 border-2 active:scale-[0.98]"
                  style={{ borderColor: `${fixture.sport.color}40` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-md"
                      style={{ background: `linear-gradient(135deg, ${fixture.sport.color} 0%, ${fixture.sport.color}dd 100%)` }}
                    >
                      <span>{fixture.sport.name}</span>
                    </div>
                    {fixture.status !== 'scheduled' && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          fixture.status === 'postponed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{fixture.title}</h3>
                  <div className="text-lg text-gray-900 mb-3 font-semibold">
                    {fixture.home_team} <span className="text-gray-400 font-normal">vs</span> {fixture.away_team}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatTime(fixture.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{fixture.field}</span>
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

  // Render via portal
  if (!mounted) return null;

  return createPortal(
    isMobile ? mobileContent : desktopContent,
    document.body
  );
}
