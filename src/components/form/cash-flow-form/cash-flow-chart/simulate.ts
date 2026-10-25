import type { ReceivableRecord, ExpensesRecord, CreditCardRecord } from "@/hooks";
import type { CreditCardBalanceRecord } from "@/store/credit-card-balance-store";
import { formatDateShort, toYMD, getEffectiveDatesSet } from "@/helpers/date";
import type { ChartDataPoint, DailyBalance, MonthlyDataPoint } from "./types";

interface SimulationInput {
  startDate: Date;
  days: number;
  initialBalance: number;
  receivables: ReceivableRecord[];
  expenses: ExpensesRecord[];
  creditCards: CreditCardRecord[];
  creditCardBalances: CreditCardBalanceRecord[];
}

/**
 * Projects the wallet balance day by day. Receivables and expenses repeat every month on their
 * day; card charges accumulate in the open invoice, which closes and is paid on the card's dates.
 */
function simulateCashFlow({
  startDate,
  days,
  initialBalance,
  receivables,
  expenses,
  creditCards,
  creditCardBalances,
}: SimulationInput): DailyBalance[] {
  const result: DailyBalance[] = [];
  let balance = initialBalance;
  const monthsAhead = Math.ceil(days / 28) + 1;

  const ccStates = creditCards.map((cc) => ({
    id: cc.id_credit_card,
    openInvoice: Number(cc.vl_balance) || 0,
    closedInvoice: 0,
    effectiveClosingDates: getEffectiveDatesSet(startDate, cc.dt_day_closing, "closing", monthsAhead),
    effectivePaymentDates: getEffectiveDatesSet(startDate, cc.vl_day, "payment", monthsAhead),
  }));

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const currentDay = date.getDate();
    const currentYMD = toYMD(date);

    balance += receivables
      .filter((r) => r.vl_day === currentDay)
      .reduce((sum, r) => sum + Number(r.vl_amount), 0);

    balance -= expenses
      .filter((e) => e.vl_day === currentDay)
      .reduce((sum, e) => sum + Number(e.vl_amount), 0);

    for (const cc of ccStates) {
      cc.openInvoice += creditCardBalances
        .filter((b) => b.id_credit_card === cc.id && b.vl_day === currentDay)
        .reduce((sum, b) => sum + Number(b.vl_amount), 0);

      if (cc.effectiveClosingDates.has(currentYMD)) {
        cc.closedInvoice += cc.openInvoice;
        cc.openInvoice = 0;
      }

      if (cc.effectivePaymentDates.has(currentYMD)) {
        balance -= cc.closedInvoice;
        cc.closedInvoice = 0;
      }
    }

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
    const label = d.date
      .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
      .replace(". de ", "/")
      .replace(" de ", "/");
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
