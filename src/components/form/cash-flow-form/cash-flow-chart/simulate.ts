import type {
  ReceivableRecord,
  ExpensesRecord,
  ExtraExpenseRecord,
  CreditCardRecord,
  CreditCardInvoiceRecord,
} from "@/hooks";
import type { CreditCardBalanceRecord } from "@/store/credit-card-balance-store";
import { formatDateShort, toYMD } from "@/helpers/date";
import { dayInMonth, getUpcomingInvoices } from "@/helpers/invoice";
import { formatMonthShort, isActiveInMonth, toMonthKey } from "@/helpers/month";
import type { ChartDataPoint, DailyBalance, MonthlyDataPoint } from "./types";

interface SimulationInput {
  startDate: Date;
  days: number;
  initialBalance: number;
  receivables: ReceivableRecord[];
  expenses: ExpensesRecord[];
  extraExpenses: ExtraExpenseRecord[];
  creditCards: CreditCardRecord[];
  creditCardBalances: CreditCardBalanceRecord[];
  invoices: CreditCardInvoiceRecord[];
}

interface DayItem {
  vl_day: number;
  vl_amount: number;
}

/** Sum of the items that fall on `date` (day 31 falls on the last day of shorter months). */
function sumOnDay<T extends DayItem>(items: T[], date: Date): number {
  return items
    .filter((i) => dayInMonth(date.getFullYear(), date.getMonth(), i.vl_day).getDate() === date.getDate())
    .reduce((sum, i) => sum + Number(i.vl_amount), 0);
}

/**
 * Projects the wallet balance day by day. Fixed bills repeat every month; receivables and extra
 * expenses follow their frequency; each card invoice (launched amount + recurring charges) is paid
 * on its due date, moved to Monday on weekends.
 */
function simulateCashFlow({
  startDate,
  days,
  initialBalance,
  receivables,
  expenses,
  extraExpenses,
  creditCards,
  creditCardBalances,
  invoices,
}: SimulationInput): DailyBalance[] {
  const result: DailyBalance[] = [];
  let balance = initialBalance;
  const monthsAhead = Math.ceil(days / 28) + 1;

  // Amount to pay on each date, across every card
  const payments = new Map<string, number>();
  for (const card of creditCards) {
    const recurring = creditCardBalances
      .filter((b) => b.id_credit_card === card.id_credit_card)
      .reduce((sum, b) => sum + Number(b.vl_amount), 0);

    for (const { monthKey, dueDate } of getUpcomingInvoices(card.vl_day, startDate, monthsAhead)) {
      const launched = invoices.find(
        (i) => i.id_credit_card === card.id_credit_card && i.dt_month === monthKey,
      );
      const key = toYMD(dueDate);
      payments.set(key, (payments.get(key) ?? 0) + Number(launched?.vl_amount ?? 0) + recurring);
    }
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const monthKey = toMonthKey(date);

    balance += sumOnDay(receivables.filter((r) => isActiveInMonth(r, monthKey)), date);
    balance -= sumOnDay(expenses, date);
    balance -= sumOnDay(extraExpenses.filter((e) => isActiveInMonth(e, monthKey)), date);
    balance -= payments.get(toYMD(date)) ?? 0;

    result.push({ date, value: Math.round(balance) });
  }

  return result;
}

/** Number of days from `startDate` until the end of the month `months` months ahead. */
function daysUntilEndOfMonth(startDate: Date, months: number): number {
  const end = new Date(startDate.getFullYear(), startDate.getMonth() + months + 1, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - startDate.getTime()) / msPerDay) + 1;
}

function toDailyPoints(daily: DailyBalance[]): ChartDataPoint[] {
  return daily.map((d) => ({ date: formatDateShort(d.date), value: d.value }));
}

/** Groups a daily projection into months: end-of-month balance and the month's lowest balance. */
function toMonthlyPoints(daily: DailyBalance[]): MonthlyDataPoint[] {
  const months = new Map<string, MonthlyDataPoint>();

  for (const d of daily) {
    const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
    const label = formatMonthShort(d.date);
    const current = months.get(key);

    if (!current) {
      months.set(key, { label, value: d.value, minValue: d.value });
    } else {
      current.value = d.value;
      current.minValue = Math.min(current.minValue, d.value);
    }
  }

  return Array.from(months.values());
}

export { simulateCashFlow, daysUntilEndOfMonth, toDailyPoints, toMonthlyPoints };
