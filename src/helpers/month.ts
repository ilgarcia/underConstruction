/**
 * Month helpers for items that repeat every month or for a number of months.
 * Months are stored as "YYYY-MM-01" strings (Postgres `date` on the first day).
 */

interface MonthlyFrequency {
  /** First month the item applies to ("YYYY-MM-01"). */
  dt_start_month: string;
  /** How many months it lasts. `null` means every month. */
  nr_months: number | null;
}

/** First day of the month of `date`, as "YYYY-MM-01". */
function toMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}-01`;
}

/** Parses "YYYY-MM-DD" into a local Date on the first day of that month. */
function parseMonthKey(key: string): Date {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

/** Adds `count` months to a "YYYY-MM-01" key. */
function addMonths(key: string, count: number): string {
  const date = parseMonthKey(key);
  return toMonthKey(new Date(date.getFullYear(), date.getMonth() + count, 1));
}

/** Months between two keys (`to` minus `from`). */
function monthDiff(from: string, to: string): number {
  const a = parseMonthKey(from);
  const b = parseMonthKey(to);
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

/** "nov/26" */
function formatMonthShort(date: Date): string {
  return date
    .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
    .replace(". de ", "/")
    .replace(" de ", "/");
}

/** "novembro" */
function formatMonthLong(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "long" });
}

/** Whether a monthly item applies to the month `monthKey`. */
function isActiveInMonth(item: MonthlyFrequency, monthKey: string): boolean {
  const offset = monthDiff(item.dt_start_month, monthKey);
  if (offset < 0) return false;
  return item.nr_months === null || offset < item.nr_months;
}

/** "Todo mês" or "3 meses · dez/26 a fev/27" */
function describeFrequency(item: MonthlyFrequency): string {
  const start = parseMonthKey(item.dt_start_month);
  if (item.nr_months === null) {
    return `Todo mês · desde ${formatMonthShort(start)}`;
  }
  const end = parseMonthKey(addMonths(item.dt_start_month, item.nr_months - 1));
  const unit = item.nr_months === 1 ? "mês" : "meses";
  const range = item.nr_months === 1
    ? formatMonthShort(start)
    : `${formatMonthShort(start)} a ${formatMonthShort(end)}`;
  return `${item.nr_months} ${unit} · ${range}`;
}

const MONTH_KEY = /^\d{4}-\d{2}-01$/;

/**
 * Reads the frequency columns from a request body. A missing or invalid nr_months means every
 * month; a missing dt_start_month is left out so the database default (this month) applies.
 */
function toFrequency(item: Record<string, unknown>): Partial<MonthlyFrequency> {
  const start = typeof item.dt_start_month === "string" ? item.dt_start_month : "";
  const months = Number(item.nr_months);
  return {
    ...(MONTH_KEY.test(start) && { dt_start_month: start }),
    nr_months: Number.isInteger(months) && months > 0 ? months : null,
  };
}

export type { MonthlyFrequency };
export {
  toMonthKey,
  parseMonthKey,
  addMonths,
  monthDiff,
  formatMonthShort,
  formatMonthLong,
  isActiveInMonth,
  describeFrequency,
  toFrequency,
};
