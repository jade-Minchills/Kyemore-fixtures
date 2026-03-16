'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, LogOut, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ParsedFixture, ClashDetection, UploadRow } from '@/lib/types';
import { detectClashes, generateSlug, getDefaultSportColor } from '@/lib/date-utils';

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedFixture[]>([]);
  const [clashes, setClashes] = useState<ClashDetection[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
    router.refresh();
  };

  const validateRow = (row: UploadRow, index: number): ParsedFixture => {
    const errors: string[] = [];
    const isEvent = row.sport?.toLowerCase().trim() === 'events';

    if (!row.sport || row.sport.trim() === '') errors.push('Sport is required');
    if (!row.title || row.title.trim() === '') errors.push('Title is required');
    
    // Home team and away team are only required for non-Events
    if (!isEvent) {
      if (!row.home_team || row.home_team.trim() === '') errors.push('Home team is required');
      if (!row.away_team || row.away_team.trim() === '') errors.push('Away team is required');
    }
    
    if (!row.date || row.date.trim() === '') errors.push('Date is required');
    if (!row.start_time || row.start_time.trim() === '') errors.push('Start time is required');
    if (!row.end_time || row.end_time.trim() === '') errors.push('End time is required');
    if (!row.field || row.field.trim() === '') errors.push('Field is required');

    // Validate date format
    if (row.date && !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      errors.push('Date must be in YYYY-MM-DD format');
    }

    // Validate time format
    if (row.start_time && !/^\d{1,2}:\d{2}$/.test(row.start_time)) {
      errors.push('Start time must be in HH:MM format');
    }
    if (row.end_time && !/^\d{1,2}:\d{2}$/.test(row.end_time)) {
      errors.push('End time must be in HH:MM format');
    }

    return {
      ...row,
      rowIndex: index,
      errors,
      warnings: [],
    };
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError('');
    setSuccess(false);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as UploadRow[];

        // Validate and parse
        const parsed = jsonData.map((row, index) => validateRow(row, index));
        setParsedData(parsed);

        // Detect clashes
        const validFixtures = parsed.filter(f => f.errors.length === 0);
        const detectedClashes = detectClashes(validFixtures);
        setClashes(detectedClashes);

        setLoading(false);
      } catch (err) {
        setError('Failed to parse file. Please ensure it\'s a valid CSV or XLSX file.');
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  const handleImport = async () => {
    setImporting(true);
    setError('');

    if (!supabase) {
      setError('Supabase is not configured. Running in demo mode.');
      setImporting(false);
      return;
    }

    try {
      // Filter out rows with errors
      const validFixtures = parsedData.filter(f => f.errors.length === 0);

      if (validFixtures.length === 0) {
        setError('No valid fixtures to import');
        setImporting(false);
        return;
      }

      // Get existing sports
      const { data: existingSports } = await supabase
        .from('sports')
        .select('name, slug, id');

      const sportsMap = new Map(
        (existingSports || []).map((s: { slug: string; id: string }) => [s.slug, s.id])
      );

      // Identify new sports
      const uniqueSports = Array.from(
        new Set(validFixtures.map(f => f.sport.trim()))
      );

      const newSports = uniqueSports.filter(
        sportName => !sportsMap.has(generateSlug(sportName))
      );

      // Create new sports
      for (const sportName of newSports) {
        const slug = generateSlug(sportName);
        const color = getDefaultSportColor(sportName);
        
        const { data, error } = await supabase
          .from('sports')
          .insert({
            name: sportName,
            slug,
            color,
            icon: slug,
            is_active: true,
          })
          .select('id')
          .single();

        if (!error && data) {
          sportsMap.set(slug, data.id);
        }
      }

      // Prepare fixtures for insertion
      const fixturesToInsert = validFixtures.map(fixture => {
        const sportSlug = generateSlug(fixture.sport);
        const sportId = sportsMap.get(sportSlug);

        return {
          sport_id: sportId,
          title: fixture.title,
          home_team: fixture.home_team,
          away_team: fixture.away_team,
          start_time: `${fixture.date}T${fixture.start_time}:00`,
          end_time: `${fixture.date}T${fixture.end_time}:00`,
          field: fixture.field,
          location_name: fixture.location_name || 'Kylemore Sports Ground',
          status: fixture.status || 'scheduled',
          notes: fixture.notes || null,
        };
      });

      // Insert fixtures
      const { error: insertError } = await supabase
        .from('fixtures')
        .insert(fixturesToInsert);

      if (insertError) {
        setError(`Failed to import fixtures: ${insertError.message}`);
        setImporting(false);
        return;
      }

      setSuccess(true);
      setImporting(false);
      setParsedData([]);
      setFile(null);
      setClashes([]);

      // Refresh data
      setTimeout(() => {
        router.push('/fixtures');
      }, 2000);
    } catch (err: any) {
      setError(`Import failed: ${err.message}`);
      setImporting(false);
    }
  };

  const hasErrors = parsedData.some(f => f.errors.length > 0);

  const downloadTemplate = () => {
    // Create sample data for the template
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const formatDateForTemplate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const templateData = [
      {
        sport: 'Rugby',
        title: 'U18 League Match',
        home_team: 'Kylemore RFC',
        away_team: 'Visiting RFC',
        date: formatDateForTemplate(today),
        start_time: '10:00',
        end_time: '11:30',
        field: 'Rugby Field',
        location_name: 'Kylemore Sports Ground',
        status: 'scheduled',
        notes: ''
      },
      {
        sport: 'Soccer',
        title: 'Senior Cup Quarter Final',
        home_team: 'Kylemore FC',
        away_team: 'Away FC',
        date: formatDateForTemplate(today),
        start_time: '14:00',
        end_time: '15:30',
        field: 'Soccer Field',
        location_name: 'Kylemore Sports Ground',
        status: 'scheduled',
        notes: ''
      },
      {
        sport: 'Events',
        title: 'Club Awards Night',
        home_team: '',
        away_team: '',
        date: formatDateForTemplate(nextWeek),
        start_time: '19:00',
        end_time: '22:00',
        field: 'Clubhouse',
        location_name: 'Kylemore Sports Ground',
        status: 'scheduled',
        notes: 'End of season awards ceremony and dinner'
      },
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fixtures');

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 10 },  // sport
      { wch: 25 },  // title
      { wch: 20 },  // home_team
      { wch: 20 },  // away_team
      { wch: 12 },  // date
      { wch: 10 },  // start_time
      { wch: 10 },  // end_time
      { wch: 12 },  // field
      { wch: 25 },  // location_name
      { wch: 10 },  // status
      { wch: 40 },  // notes
    ];

    // Download the file
    XLSX.writeFile(wb, 'fixtures_template.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Upload</h1>
              <p className="text-gray-600 mt-1">Upload fixtures from CSV or XLSX</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/fixtures"
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                View Fixtures
              </a>
              <button
                onClick={handleLogout}
                data-testid="logout-button"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Upload Spreadsheet</h2>
          </div>

          <div className="mb-6">
            <label
              htmlFor="file-upload"
              data-testid="file-upload-label"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV or XLSX file</p>
                {file && (
                  <p className="mt-2 text-sm font-medium text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <input
                id="file-upload"
                data-testid="file-upload-input"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Required Columns:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><code className="bg-blue-100 px-1 rounded">sport</code> - Sport name (e.g., Rugby, Soccer, Events)</p>
              <p><code className="bg-blue-100 px-1 rounded">title</code> - Fixture title (e.g., U18 Rugby)</p>
              <p><code className="bg-blue-100 px-1 rounded">home_team</code> - Home team name (leave empty for Events)</p>
              <p><code className="bg-blue-100 px-1 rounded">away_team</code> - Away team name (leave empty for Events)</p>
              <p><code className="bg-blue-100 px-1 rounded">date</code> - Date in YYYY-MM-DD format</p>
              <p><code className="bg-blue-100 px-1 rounded">start_time</code> - Start time in HH:MM format</p>
              <p><code className="bg-blue-100 px-1 rounded">end_time</code> - End time in HH:MM format</p>
              <p><code className="bg-blue-100 px-1 rounded">field</code> - Field name: Rugby Field, Soccer Field, or Clubhouse</p>
            </div>
          </div>

          {/* Download Template Button */}
          <button
            onClick={downloadTemplate}
            data-testid="download-template-button"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Download Template (XLSX)
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3" data-testid="success-message">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Import Successful!</p>
              <p className="text-sm text-green-700">Fixtures have been imported. Redirecting to fixtures page...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3" data-testid="error-message">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Clash Warnings */}
        {clashes.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6" data-testid="clash-warnings">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-2">
                  {clashes.length} Scheduling Clash(es) Detected
                </p>
                <div className="space-y-2">
                  {clashes.map((clash, index) => (
                    <div key={index} className="text-sm text-yellow-800 bg-yellow-100 rounded p-2">
                      {clash.message}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  You can still import, but these fixtures have overlapping times on the same field.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {parsedData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Preview ({parsedData.length} rows)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="preview-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Row</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sport</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Teams</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedData.map((row) => (
                    <tr
                      key={row.rowIndex}
                      className={row.errors.length > 0 ? 'bg-red-50' : ''}
                      data-testid={`preview-row-${row.rowIndex}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{row.rowIndex + 2}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.sport}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {row.home_team && row.away_team 
                          ? `${row.home_team} vs ${row.away_team}`
                          : <span className="text-gray-400 italic">N/A (Event)</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.start_time} - {row.end_time}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.field}</td>
                      <td className="px-4 py-3">
                        {row.errors.length > 0 ? (
                          <div className="text-xs text-red-600">
                            {row.errors.map((err, i) => (
                              <div key={i}>{err}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import Button */}
            <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {hasErrors && (
                    <p className="text-red-600 font-medium">
                      Cannot import: {parsedData.filter(f => f.errors.length > 0).length} row(s) with errors
                    </p>
                  )}
                  {!hasErrors && (
                    <p className="text-green-600 font-medium">
                      Ready to import {parsedData.length} fixture(s)
                    </p>
                  )}
                </div>
                <button
                  onClick={handleImport}
                  data-testid="import-button"
                  disabled={hasErrors || importing}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import Fixtures'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
