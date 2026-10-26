import { getEffectivePaymentDate } from "./date";
import { toMonthKey } from "./month";

interface UpcomingInvoice {
  /** Due month as "YYYY-MM-01", the key used by tbl_credit_card_invoices. */
  monthKey: string;
  /** Payment date, moved to Monday when it falls on a weekend. */
  dueDate: Date;
}

/** The given day in a month, clamped to the month's last day (31 -> 28 in February). */
function dayInMonth(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

/**
 * The next `count` invoices of a card, starting with the first one due on or after `startDate`.
 */
function getUpcomingInvoices(
  paymentDay: number,
  startDate: Date,
  count: number,
): UpcomingInvoice[] {
  const invoices: UpcomingInvoice[] = [];
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  for (let offset = 0; invoices.length < count; offset++) {
    const dueDate = getEffectivePaymentDate(dayInMonth(year, month + offset, paymentDay));
    if (dueDate < startDate) continue;
    invoices.push({ monthKey: toMonthKey(new Date(year, month + offset, 1)), dueDate });
  }

  return invoices;
}

export type { UpcomingInvoice };
export { dayInMonth, getUpcomingInvoices };
