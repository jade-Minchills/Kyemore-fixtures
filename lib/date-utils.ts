import { format, parseISO, startOfWeek, addDays, isWithinInterval, isSameDay } from 'date-fns';
import { ParsedFixture, ClashDetection } from './types';

/**
 * Get the start and end of the current week (Monday to Sunday)
 */
export function getCurrentWeekRange(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = addDays(start, 6); // Sunday
  return { start, end };
}

/**
 * Get array of dates for the week
 */
export function getWeekDays(startDate: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

/**
 * Format time from ISO string
 */
export function formatTime(isoString: string) {
  return format(parseISO(isoString), 'h:mm a');
}

/**
 * Format date
 */
export function formatDate(isoString: string, formatStr: string = 'MMM d, yyyy') {
  return format(parseISO(isoString), formatStr);
}

/**
 * Check if two time ranges overlap
 */
export function doTimesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  return s1 < e2 && s2 < e1;
}

/**
 * Detect clashes in fixture list
 */
export function detectClashes(fixtures: ParsedFixture[]): ClashDetection[] {
  const clashes: ClashDetection[] = [];

  for (let i = 0; i < fixtures.length; i++) {
    for (let j = i + 1; j < fixtures.length; j++) {
      const fixture1 = fixtures[i];
      const fixture2 = fixtures[j];

      // Check if same field
      if (fixture1.field.toLowerCase().trim() === fixture2.field.toLowerCase().trim()) {
        // Combine date and time
        const start1 = `${fixture1.date}T${fixture1.start_time}`;
        const end1 = `${fixture1.date}T${fixture1.end_time}`;
        const start2 = `${fixture2.date}T${fixture2.start_time}`;
        const end2 = `${fixture2.date}T${fixture2.end_time}`;

        if (doTimesOverlap(start1, end1, start2, end2)) {
          clashes.push({
            fixture1,
            fixture2,
            message: `Clash on ${fixture1.field}: Row ${fixture1.rowIndex + 2} and Row ${fixture2.rowIndex + 2} overlap`,
          });
        }
      }
    }
  }

  return clashes;
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get default color for a sport
 */
const sportColors: Record<string, string> = {
  rugby: '#10B981',
  soccer: '#F59E0B',
  football: '#F59E0B',
  cricket: '#3B82F6',
  basketball: '#EF4444',
  tennis: '#8B5CF6',
  hockey: '#06B6D4',
  volleyball: '#EC4899',
  events: '#8B5CF6',
};

export function getDefaultSportColor(sportName: string): string {
  const slug = generateSlug(sportName);
  return sportColors[slug] || '#6B7280'; // Default gray
}

/**
 * Calculate position in calendar grid (percentage from top)
 */
export function getTimePosition(time: string, startHour: number = 8): number {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = (hours - startHour) * 60 + minutes;
  const totalGridMinutes = 15 * 60; // 8AM to 11PM = 15 hours
  return Math.max(0, Math.min(100, (totalMinutes / totalGridMinutes) * 100));
}

/**
 * Calculate height in calendar grid (percentage)
 */
export function getEventHeight(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const totalGridMinutes = 15 * 60; // 15 hours (8AM to 11PM)
  return Math.max((durationMinutes / totalGridMinutes) * 100, 3); // Minimum 3%
}