/**
 * Formats a Date object to YYYY-MM-DD string without timezone offset
 * This ensures the date selected by the user is the date sent to the API
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a date string (YYYY-MM-DD or ISO string) to a Date object in local timezone
 * This prevents timezone offset issues when displaying dates
 */
export function parseDateFromAPI(dateString: string | Date): Date {
  if (!dateString) return new Date();
  
  // If already a Date object, return it
  if (dateString instanceof Date) return dateString;
  
  // Extract just the date part if it's an ISO string with time
  const dateOnly = dateString.split('T')[0];
  
  // Parse as local date without timezone conversion
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
}
