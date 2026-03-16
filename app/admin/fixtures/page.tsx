'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, CheckCircle, X, Calendar, Clock, MapPin, Search, Pencil, Check } from 'lucide-react';
import { FixtureWithSport } from '@/lib/types';
import { AdminHeader } from '@/components/AdminHeader';

const FIELDS = ['Rugby Field', 'Soccer Field', 'Clubhouse'] as const;
const STATUSES = ['scheduled', 'postponed', 'cancelled'] as const;

function toDateInput(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}
function toTimeInput(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function formatDisplayDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatDisplayTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
}

interface EditForm {
  title: string;
  home_team: string;
  away_team: string;
  date: string;
  startTime: string;
  endTime: string;
  field: string;
  status: string;
}

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState<FixtureWithSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
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

  useEffect(() => { fetchFixtures(); }, [fetchFixtures]);

  const startEdit = (fixture: FixtureWithSport) => {
    setEditingId(fixture.id);
    setEditForm({
      title: fixture.title,
      home_team: fixture.home_team ?? '',
      away_team: fixture.away_team ?? '',
      date: toDateInput(fixture.start_time),
      startTime: toTimeInput(fixture.start_time),
      endTime: toTimeInput(fixture.end_time),
      field: fixture.field ?? '',
      status: fixture.status,
    });
    setError('');
  };

  const cancelEdit = () => { setEditingId(null); setEditForm(null); };

  const handleSave = async (fixture: FixtureWithSport) => {
    if (!editForm || !supabase) return;
    setSavingId(fixture.id);
    setError('');

    const start_time = `${editForm.date}T${editForm.startTime}:00`;
    const end_time = `${editForm.date}T${editForm.endTime}:00`;

    if (new Date(end_time) <= new Date(start_time)) {
      setError('End time must be after start time.');
      setSavingId(null);
      return;
    }

    const { error: updateError } = await supabase
      .from('fixtures')
      .update({
        title: editForm.title.trim(),
        home_team: editForm.home_team.trim() || null,
        away_team: editForm.away_team.trim() || null,
        start_time,
        end_time,
        field: editForm.field || null,
        status: editForm.status,
      })
      .eq('id', fixture.id);

    if (updateError) {
      setError(`Failed to save: ${updateError.message}`);
    } else {
      setSuccess(`"${editForm.title}" updated.`);
      setFixtures(prev => prev.map(f =>
        f.id === fixture.id
          ? { ...f, title: editForm.title.trim(), home_team: editForm.home_team || null, away_team: editForm.away_team || null, start_time, end_time, field: editForm.field || null, status: editForm.status as FixtureWithSport['status'] }
          : f
      ));
      cancelEdit();
    }
    setSavingId(null);
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError('');
    setSuccess('');
    if (!supabase) { setError('Supabase is not configured.'); setDeletingId(null); return; }
    const { error: deleteError } = await supabase.from('fixtures').delete().eq('id', id);
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

  const inputCls = 'w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 text-sm transition-colors';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <AdminHeader title="Manage Fixtures" subtitle="Edit and delete fixtures" activePage="fixtures" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">

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

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, sport, field, or team…"
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors shadow-sm text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b-2 border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              All Fixtures
              {!loading && <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length}{search ? ` of ${fixtures.length}` : ''})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading fixtures…</div>
          ) : fixtures.length === 0 ? (
            <div className="p-12 text-center"><div className="text-5xl mb-4">📋</div><p className="text-gray-500">No fixtures found.</p></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No fixtures match your search.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map(fixture => {
                const isEditing = editingId === fixture.id;

                return (
                  <li key={fixture.id} className={`px-4 sm:px-6 py-4 sm:py-5 transition-colors ${isEditing ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    {isEditing && editForm ? (
                      /* ── Edit Form ── */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                            <input className={inputCls} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Home Team</label>
                            <input className={inputCls} value={editForm.home_team} onChange={e => setEditForm({ ...editForm, home_team: e.target.value })} placeholder="Optional" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Away Team</label>
                            <input className={inputCls} value={editForm.away_team} onChange={e => setEditForm({ ...editForm, away_team: e.target.value })} placeholder="Optional" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                            <input type="date" className={inputCls} value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
                              <input type="time" className={inputCls} value={editForm.startTime} onChange={e => setEditForm({ ...editForm, startTime: e.target.value })} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
                              <input type="time" className={inputCls} value={editForm.endTime} onChange={e => setEditForm({ ...editForm, endTime: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Field</label>
                            <select className={inputCls + ' bg-white'} value={editForm.field} onChange={e => setEditForm({ ...editForm, field: e.target.value })}>
                              <option value="">— None —</option>
                              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select className={inputCls + ' bg-white'} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleSave(fixture)}
                            disabled={savingId === fixture.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                            {savingId === fixture.id ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={cancelEdit} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Read View ── */
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="mt-1 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: fixture.sport?.color ?? '#6B7280' }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: fixture.sport?.color ?? '#6B7280' }}>
                              {fixture.sport?.name ?? 'Unknown'}
                            </span>
                            {fixture.status !== 'scheduled' && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${fixture.status === 'postponed' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                              </span>
                            )}
                          </div>
                          <p className="text-base font-bold text-gray-900">{fixture.title}</p>
                          {fixture.home_team && fixture.away_team && (
                            <p className="text-sm text-gray-600 mt-0.5">{fixture.home_team} <span className="text-gray-400">vs</span> {fixture.away_team}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" />{formatDisplayDate(fixture.start_time)}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{formatDisplayTime(fixture.start_time)} – {formatDisplayTime(fixture.end_time)}</span>
                            {fixture.field && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{fixture.field}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => startEdit(fixture)} title="Edit fixture" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fixture.id, fixture.home_team && fixture.away_team ? `${fixture.title} (${fixture.home_team} vs ${fixture.away_team})` : fixture.title)}
                            disabled={deletingId === fixture.id}
                            title="Delete fixture"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
