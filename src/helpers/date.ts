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

/**
 * Formats a date to "YYYY-M-D" string for comparison purposes.
 *
 * @param date - The date object to format
 * @returns Formatted date string
 */
function toYMD(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * Adjusts a credit card closing date to avoid weekends.
 * If the date falls on a Saturday or Sunday, it is anticipated to Friday.
 */
function getEffectiveClosingDate(date: Date): Date {
  const adjustedDate = new Date(date);
  const dayOfWeek = adjustedDate.getDay();
  if (dayOfWeek === 6) adjustedDate.setDate(adjustedDate.getDate() - 1); // Saturday -> Friday
  if (dayOfWeek === 0) adjustedDate.setDate(adjustedDate.getDate() - 2); // Sunday -> Friday
  return adjustedDate;
}

/**
 * Adjusts a credit card payment date to avoid weekends.
 * If the date falls on a Saturday or Sunday, it is postponed to Monday.
 */
function getEffectivePaymentDate(date: Date): Date {
  const adjustedDate = new Date(date);
  const dayOfWeek = adjustedDate.getDay();
  if (dayOfWeek === 6) adjustedDate.setDate(adjustedDate.getDate() + 2); // Saturday -> Monday
  if (dayOfWeek === 0) adjustedDate.setDate(adjustedDate.getDate() + 1); // Sunday -> Monday
  return adjustedDate;
}

/**
 * Generates a Set of "YYYY-M-D" effective dates for a given day of the month,
 * spanning a window of months (previous, current, next `monthsAhead`).
 * 
 * @param startDate - The reference start date for the window
 * @param dayOfMonth - The target day of the month
 * @param type - Whether this is a "closing" date (anticipates to Friday) 
 *               or "payment" date (postpones to Monday)
 * @param monthsAhead - How many months after the start month the window covers
 * @returns Set of formatted date strings
 */
function getEffectiveDatesSet(
  startDate: Date, 
  dayOfMonth: number, 
  type: "closing" | "payment",
  monthsAhead = 2
): Set<string> {
  const effectiveDates = new Set<string>();
  const startY = startDate.getFullYear();
  const startM = startDate.getMonth();

  for (let offset = -1; offset <= monthsAhead; offset++) {
    let d = new Date(startY, startM + offset, dayOfMonth);
    if (type === "closing") {
      d = getEffectiveClosingDate(d);
    } else {
      d = getEffectivePaymentDate(d);
    }
    effectiveDates.add(toYMD(d));
  }

  return effectiveDates;
}

// Exports
export { 
  formatDate, 
  formatDateShort, 
  getTodayFormatted, 
  toYMD,
  getEffectiveClosingDate,
  getEffectivePaymentDate,
  getEffectiveDatesSet
};
