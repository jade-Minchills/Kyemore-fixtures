'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitEvent(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const venue = formData.get('venue') as 'Rugby Field' | 'Soccer Field' | 'Clubhouse';
  const start_datetime = formData.get('start_datetime') as string;
  const end_datetime = formData.get('end_datetime') as string;

  // Basic validation
  if (!title || !venue || !start_datetime || !end_datetime) {
    return { error: 'Please fill out all required fields.' };
  }

  const { error } = await supabase
    .from('events')
    .insert([
      {
        title,
        description: description || null,
        venue,
        start_datetime,
        end_datetime,
        status: 'scheduled',
      },
    ]);

  if (error) {
    console.error('Error submitting event:', error);
    return { error: 'Failed to submit event. Please try again later.' };
  }

  revalidatePath('/fixtures');
  revalidatePath('/');
  
  return { success: true };
}
