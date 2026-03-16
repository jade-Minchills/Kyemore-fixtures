'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  LogOut,
  X,
  Calendar,
  Clock,
  MapPin,
  Search,
} from 'lucide-react';
import { FixtureWithSport } from '@/lib/types';

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

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState<FixtureWithSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const fetchFixtures = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from('fixtures')
      .select('*, sport:sports(*)')
      .order('start_time');
    if (!fetchError) setFixtures((data as FixtureWithSport[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError('');
    setSuccess('');

    if (!supabase) {
      setError('Supabase is not configured.');
      setDeletingId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from('fixtures')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(`Failed to delete: ${deleteError.message}`);
    } else {
      setSuccess(`"${label}" deleted.`);
      setFixtures(prev => prev.filter(f => f.id !== id));
    }
    setDeletingId(null);
  };

  const filtered = fixtures.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.sport?.name?.toLowerCase().includes(q) ||
      f.field?.toLowerCase().includes(q) ||
      f.home_team?.toLowerCase().includes(q) ||
      f.away_team?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Fixtures</h1>
              <p className="text-gray-600 mt-1">View and delete existing fixtures</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin/upload" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                CSV Upload
              </a>
              <a href="/admin/events" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                Manage Events
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, sport, field, or team…"
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors shadow-sm"
          />
        </div>

        {/* Fixtures list */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              All Fixtures
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filtered.length}{search ? ` of ${fixtures.length}` : ''})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading fixtures…</div>
          ) : fixtures.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500">No fixtures found.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No fixtures match your search.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map(fixture => (
                <li key={fixture.id} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
                  {/* Sport colour dot */}
                  <div
                    className="mt-1 w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: fixture.sport?.color ?? '#6B7280' }}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Sport tag + status */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: fixture.sport?.color ?? '#6B7280' }}
                      >
                        {fixture.sport?.name ?? 'Unknown'}
                      </span>
                      {fixture.status !== 'scheduled' && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          fixture.status === 'postponed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                        </span>
                      )}
                    </div>

                    <p className="text-base font-bold text-gray-900">{fixture.title}</p>

                    {fixture.home_team && fixture.away_team && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {fixture.home_team} <span className="text-gray-400">vs</span> {fixture.away_team}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDisplayDate(fixture.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDisplayTime(fixture.start_time)} – {formatDisplayTime(fixture.end_time)}
                      </span>
                      {fixture.field && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {fixture.field}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(
                      fixture.id,
                      fixture.home_team && fixture.away_team
                        ? `${fixture.title} (${fixture.home_team} vs ${fixture.away_team})`
                        : fixture.title
                    )}
                    disabled={deletingId === fixture.id}
                    title="Delete fixture"
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
