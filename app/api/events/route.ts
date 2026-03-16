import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_VENUES = ['Rugby Field', 'Soccer Field', 'Clubhouse'] as const;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify the user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, description, venue, start_datetime, end_datetime, status } =
    body as Record<string, unknown>;

  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (!venue || !VALID_VENUES.includes(venue as (typeof VALID_VENUES)[number])) {
    return NextResponse.json(
      { error: `venue must be one of: ${VALID_VENUES.join(', ')}` },
      { status: 400 }
    );
  }
  if (!start_datetime || typeof start_datetime !== 'string') {
    return NextResponse.json({ error: 'start_datetime is required' }, { status: 400 });
  }
  if (!end_datetime || typeof end_datetime !== 'string') {
    return NextResponse.json({ error: 'end_datetime is required' }, { status: 400 });
  }

  const resolvedStatus =
    status && ['scheduled', 'postponed', 'cancelled'].includes(status as string)
      ? status
      : 'scheduled';

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: title.trim(),
      description: description ? String(description).trim() : null,
      venue,
      start_datetime,
      end_datetime,
      status: resolvedStatus,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
