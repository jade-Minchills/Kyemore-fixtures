// Database Types
export interface Sport {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Fixture {
  id: string;
  sport_id: string;
  title: string;
  home_team: string | null;
  away_team: string | null;
  start_time: string;
  end_time: string;
  field: string | null;
  location_name: string;
  status: 'scheduled' | 'postponed' | 'cancelled';
  notes: string | null;
  created_at: string;
  sport?: Sport;
}

export interface FixtureWithSport extends Fixture {
  sport: Sport;
}

// Upload Types
export interface UploadRow {
  sport: string;
  title: string;
  home_team: string;
  away_team: string;
  date: string;
  start_time: string;
  end_time: string;
  field: string;
  location_name?: string;
  status?: 'scheduled' | 'postponed' | 'cancelled';
  notes?: string;
}

export interface ParsedFixture extends UploadRow {
  rowIndex: number;
  errors: string[];
  warnings: string[];
}

export interface ClashDetection {
  fixture1: ParsedFixture;
  fixture2: ParsedFixture;
  message: string;
}