import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_VENUES = ['Rugby Field', 'Soccer Field', 'Clubhouse'] as const;
const VALID_STATUSES = ['scheduled', 'postponed', 'cancelled'] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, description, venue, start_datetime, end_datetime, status } = body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
  }
  if (venue !== undefined && !VALID_VENUES.includes(venue as typeof VALID_VENUES[number])) {
    return NextResponse.json({ error: `venue must be one of: ${VALID_VENUES.join(', ')}` }, { status: 400 });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = (title as string).trim();
  if (description !== undefined) updates.description = description || null;
  if (venue !== undefined) updates.venue = venue;
  if (start_datetime !== undefined) updates.start_datetime = start_datetime;
  if (end_datetime !== undefined) updates.end_datetime = end_datetime;
  if (status !== undefined) updates.status = status;

  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Event id is required' }, { status: 400 });
  }

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
