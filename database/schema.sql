-- Kylemore Sports Ground Fixtures Database Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Create sports table
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL DEFAULT '#6B7280',
    icon TEXT DEFAULT 'circle',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create fixtures table
CREATE TABLE IF NOT EXISTS public.fixtures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    home_team TEXT,
    away_team TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    field TEXT,
    location_name TEXT DEFAULT 'Kylemore Sports Ground',
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'postponed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create events table (manually-created events, no sport/team fields)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    venue TEXT NOT NULL CHECK (venue IN ('Rugby Field', 'Soccer Field', 'Clubhouse')),
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'postponed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fixtures_start_time ON public.fixtures(start_time);
CREATE INDEX IF NOT EXISTS idx_fixtures_sport_id ON public.fixtures(sport_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_field ON public.fixtures(field);
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON public.fixtures(status);
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Public can read active sports
CREATE POLICY "Public can read active sports"
    ON public.sports
    FOR SELECT
    USING (is_active = TRUE);

-- Public can read fixtures
CREATE POLICY "Public can read fixtures"
    ON public.fixtures
    FOR SELECT
    USING (TRUE);

-- Authenticated users can insert sports
CREATE POLICY "Authenticated users can insert sports"
    ON public.sports
    FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Authenticated users can update sports
CREATE POLICY "Authenticated users can update sports"
    ON public.sports
    FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Authenticated users can delete sports
CREATE POLICY "Authenticated users can delete sports"
    ON public.sports
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- Authenticated users can insert fixtures
CREATE POLICY "Authenticated users can insert fixtures"
    ON public.fixtures
    FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Authenticated users can update fixtures
CREATE POLICY "Authenticated users can update fixtures"
    ON public.fixtures
    FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Authenticated users can delete fixtures
CREATE POLICY "Authenticated users can delete fixtures"
    ON public.fixtures
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- Public can read events
CREATE POLICY "Public can read events"
    ON public.events
    FOR SELECT
    USING (TRUE);

-- Authenticated users can insert events
CREATE POLICY "Authenticated users can insert events"
    ON public.events
    FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Authenticated users can delete events
CREATE POLICY "Authenticated users can delete events"
    ON public.events
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- 6. Insert seed data for initial sports
INSERT INTO public.sports (name, slug, color, icon, is_active) VALUES
    ('Rugby', 'rugby', '#10B981', 'rugby', TRUE),
    ('Soccer', 'soccer', '#F59E0B', 'soccer', TRUE),
    ('Events', 'events', '#8B5CF6', 'calendar', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 7. Insert sample fixtures (optional - for testing)
DO $$
DECLARE
    rugby_id UUID;
    soccer_id UUID;
BEGIN
    -- Get sport IDs
    SELECT id INTO rugby_id FROM public.sports WHERE slug = 'rugby';
    SELECT id INTO soccer_id FROM public.sports WHERE slug = 'soccer';

    -- Insert sample fixtures for the current week
    INSERT INTO public.fixtures (sport_id, title, home_team, away_team, start_time, end_time, field, status) VALUES
        (rugby_id, 'U18 Rugby', 'Kylemore', 'St. Mary''s', 
            date_trunc('week', CURRENT_DATE) + interval '1 day 10 hours',
            date_trunc('week', CURRENT_DATE) + interval '1 day 11 hours 30 minutes',
            'Field 1', 'scheduled'),
        (rugby_id, 'Senior Rugby', 'Blues', 'Reds',
            date_trunc('week', CURRENT_DATE) + interval '3 days 16 hours',
            date_trunc('week', CURRENT_DATE) + interval '3 days 17 hours 30 minutes',
            'Field 3', 'scheduled'),
        (soccer_id, 'Premier Soccer', 'City FC', 'Rovers',
            date_trunc('week', CURRENT_DATE) + interval '2 days 17 hours 30 minutes',
            date_trunc('week', CURRENT_DATE) + interval '2 days 19 hours',
            'Field 2', 'scheduled'),
        (soccer_id, 'Social Soccer', 'Team A', 'Team B',
            date_trunc('week', CURRENT_DATE) + interval '3 days 19 hours 30 minutes',
            date_trunc('week', CURRENT_DATE) + interval '3 days 21 hours',
            'Field 1', 'scheduled'),
        (rugby_id, 'U18 Rugby', 'Kylemore', 'Oakwood',
            date_trunc('week', CURRENT_DATE) + interval '4 days 18 hours',
            date_trunc('week', CURRENT_DATE) + interval '4 days 19 hours 30 minutes',
            'Field 2', 'scheduled'),
        (soccer_id, 'Jnr Soccer', 'Lions', 'Tigers',
            date_trunc('week', CURRENT_DATE) + interval '5 days 10 hours',
            date_trunc('week', CURRENT_DATE) + interval '5 days 11 hours 30 minutes',
            'Field 1', 'scheduled'),
        (rugby_id, 'Women''s Rugby', 'Kylemore', 'Valley',
            date_trunc('week', CURRENT_DATE) + interval '6 days 14 hours',
            date_trunc('week', CURRENT_DATE) + interval '6 days 15 hours 30 minutes',
            'Field 3', 'scheduled');
END $$;