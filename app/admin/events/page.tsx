'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  LogOut,
  X,
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
} from 'lucide-react';
import { Event, FixtureWithSport } from '@/lib/types';

const VENUES = ['Rugby Field', 'Soccer Field', 'Clubhouse'] as const;
const STATUSES = ['scheduled', 'postponed', 'cancelled'] as const;

// Unified row shown in the list — can come from either table
interface EventRow {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  start: string;
  end: string;
  status: string;
  source: 'manual' | 'csv'; // which table to delete from
}

function formatDisplayDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDisplayTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminEventsPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState<(typeof VENUES)[number]>('Clubhouse');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('scheduled');

  const router = useRouter();
  const supabase = createClient();

  const fetchAllEvents = useCallback(async () => {
    if (!supabase) return;

    // Fetch from the manual events table
    const { data: manualEvents } = await supabase
      .from('events')
      .select('*')
      .order('start_datetime');

    // Fetch fixtures where sport slug = 'events'
    const { data: fixtureEvents } = await supabase
      .from('fixtures')
      .select('*, sport:sports(*)')
      .order('start_time');

    const manualRows: EventRow[] = ((manualEvents as Event[]) ?? []).map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      venue: e.venue,
      start: e.start_datetime,
      end: e.end_datetime,
      status: e.status,
      source: 'manual',
    }));

    const csvRows: EventRow[] = ((fixtureEvents as FixtureWithSport[]) ?? [])
      .filter(f => f.sport?.slug === 'events')
      .map(f => ({
        id: f.id,
        title: f.title,
        description: f.notes,
        venue: f.field ?? '',
        start: f.start_time,
        end: f.end_time,
        status: f.status,
        source: 'csv',
      }));

    // Merge and sort by start date
    const combined = [...manualRows, ...csvRows].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    setRows(combined);
    setLoadingEvents(false);
  }, [supabase]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVenue('Clubhouse');
    setDate('');
    setStartTime('');
    setEndTime('');
    setStatus('scheduled');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!date || !startTime || !endTime) {
      setError('Date, start time and end time are required.');
      return;
    }

    const start_datetime = `${date}T${startTime}:00`;
    const end_datetime = `${date}T${endTime}:00`;

    if (new Date(end_datetime) <= new Date(start_datetime)) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || null, venue, start_datetime, end_datetime, status }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to create event.');
        setSubmitting(false);
        return;
      }

      setSuccess(`"${title}" has been added.`);
      resetForm();
      await fetchAllEvents();
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: EventRow) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setDeletingId(row.id);
    setError('');
    setSuccess('');

    try {
      if (row.source === 'manual') {
        // Delete via the API route (server-side auth check)
        const res = await fetch(`/api/events/${row.id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? 'Failed to delete event.');
          setDeletingId(null);
          return;
        }
      } else {
        // Delete from fixtures table directly (RLS allows authenticated users)
        if (!supabase) { setError('Not connected.'); setDeletingId(null); return; }
        const { error: deleteError } = await supabase.from('fixtures').delete().eq('id', row.id);
        if (deleteError) {
          setError(`Failed to delete: ${deleteError.message}`);
          setDeletingId(null);
          return;
        }
      }

      setSuccess(`"${row.title}" has been deleted.`);
      setRows(prev => prev.filter(r => r.id !== row.id));
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
              <p className="text-gray-600 mt-1">Create and remove events manually</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin/upload" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                CSV Upload
              </a>
              <a href="/admin/fixtures" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                Manage Fixtures
              </a>
              <a href="/fixtures" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                View Fixtures
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Feedback banners */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="font-semibold text-green-900 flex-1">{success}</p>
            <button onClick={() => setSuccess('')}><X className="w-5 h-5 text-green-600" /></button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="font-semibold text-red-900 flex-1">{error}</p>
            <button onClick={() => setError('')}><X className="w-5 h-5 text-red-600" /></button>
          </div>
        )}

        {/* Create Event Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <CalendarPlus className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Club Awards Night"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-gray-900 placeholder:text-gray-600"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional details about the event"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none text-gray-900 placeholder:text-gray-600"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <select
                  value={venue}
                  onChange={e => setVenue(e.target.value as (typeof VENUES)[number])}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors bg-white text-gray-900"
                >
                  {VENUES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as (typeof STATUSES)[number])}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors bg-white text-gray-900"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-gray-900 placeholder:text-gray-600"
                />
              </div>

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-gray-900 placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-gray-900 placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                {submitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              All Events
              {!loadingEvents && (
                <span className="ml-2 text-sm font-normal text-gray-500">({rows.length})</span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Includes manually added events and CSV-imported events</p>
          </div>

          {loadingEvents ? (
            <div className="p-12 text-center text-gray-500">Loading events…</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-500">No events yet. Add one above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rows.map(row => (
                <li key={`${row.source}-${row.id}`} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="mt-1 w-3 h-3 rounded-full flex-shrink-0 bg-purple-500" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-gray-900">{row.title}</span>
                      {/* Source badge */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.source === 'csv'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {row.source === 'csv' ? 'CSV' : 'Manual'}
                      </span>
                      {row.status !== 'scheduled' && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          row.status === 'postponed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      )}
                    </div>
                    {row.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{row.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDisplayDate(row.start)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDisplayTime(row.start)} – {formatDisplayTime(row.end)}
                      </span>
                      {row.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {row.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={deletingId === row.id}
                    title="Delete event"
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
