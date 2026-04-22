/**
 * Formats a date to Brazilian Portuguese (pt-BR).
 *
 * @param date - The date object to format
 * @param options - Custom Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  return date.toLocaleDateString("pt-BR", options);
}

/**
 * Shorthand for formatting a date as "dd/mm".
 *
 * @param date - The date object to format
 * @returns Formatted date string (e.g., "18/04")
 */
function formatDateShort(date: Date): string {
  return formatDate(date, {
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Returns today's date formatted to Brazilian Portuguese (pt-BR).
 *
 * @param options - Custom Intl.DateTimeFormatOptions
 * @returns Formatted date string for today
 */
function getTodayFormatted(
  options?: Intl.DateTimeFormatOptions
): string {
  return formatDate(new Date(), options);
}

// Exports
export { formatDate, formatDateShort, getTodayFormatted };
