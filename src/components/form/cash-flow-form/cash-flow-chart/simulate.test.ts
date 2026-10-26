import type {
  CreditCardInvoiceRecord,
  CreditCardRecord,
  ExpensesRecord,
  ExtraExpenseRecord,
  ReceivableRecord,
} from "@/hooks";
import {
  daysUntilEndOfMonth,
  simulateCashFlow,
  toDailyPoints,
  toMonthlyPoints,
} from "./simulate";

type CreditCardBalanceRecord =
  Parameters<typeof simulateCashFlow>[0]["creditCardBalances"][number];

const timestamps = { dt_created: "", dt_updated: "" };
const base = { id_user_wallet: "wallet", ...timestamps };

const receivable = (r: Partial<ReceivableRecord>): ReceivableRecord => ({
  ...base,
  id_receivable: "r",
  ds_description: "Salário",
  vl_amount: 0,
  vl_day: 1,
  dt_start_month: "2026-01-01",
  nr_months: null,
  ...r,
});

const expense = (e: Partial<ExpensesRecord>): ExpensesRecord => ({
  ...base,
  id_expense: "e",
  ds_description: "Aluguel",
  vl_amount: 0,
  vl_day: 1,
  ...e,
});

const extraExpense = (e: Partial<ExtraExpenseRecord>): ExtraExpenseRecord => ({
  ...base,
  id_extra_expense: "x",
  ds_description: "Curso",
  vl_amount: 0,
  vl_day: 1,
  dt_start_month: "2026-01-01",
  nr_months: null,
  ...e,
});

const card: CreditCardRecord = {
  ...base,
  id_credit_card: "card",
  ds_description: "Cartão",
  vl_day: 7,
  dt_day_closing: 30,
};

const cardBalance: CreditCardBalanceRecord = {
  ...timestamps,
  id_credit_card_balance: "b",
  id_credit_card: "card",
  ds_description: "Streaming",
  vl_amount: 50,
  vl_day: 7,
};

const invoice: CreditCardInvoiceRecord = {
  ...timestamps,
  id_credit_card_invoice: "i",
  id_credit_card: "card",
  dt_month: "2026-11-01",
  vl_amount: 800,
};

// Monday, 2 Nov 2026
const startDate = new Date(2026, 10, 2);

const emptyInput = {
  startDate,
  days: daysUntilEndOfMonth(startDate, 0),
  initialBalance: 1000,
  receivables: [],
  expenses: [],
  extraExpenses: [],
  creditCards: [],
  creditCardBalances: [],
  invoices: [],
};

/** Balance at the end of the given day of November 2026. */
const balanceOn = (daily: ReturnType<typeof simulateCashFlow>, day: number): number => {
  const point = daily.find((d) => d.date.getDate() === day && d.date.getMonth() === 10);
  if (!point) throw new Error(`No projection for day ${day}`);
  return point.value;
};

describe("daysUntilEndOfMonth", () => {
  it("counts the start day through the last day of the month", () => {
    expect(daysUntilEndOfMonth(startDate, 0)).toBe(29);
    expect(daysUntilEndOfMonth(new Date(2026, 0, 31), 1)).toBe(29);
  });
});

describe("simulateCashFlow", () => {
  it("keeps the balance flat when nothing is scheduled", () => {
    const daily = simulateCashFlow(emptyInput);
    expect(daily).toHaveLength(29);
    expect(daily.every((d) => d.value === 1000)).toBe(true);
  });

  it("applies receivables and fixed expenses on their day", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      receivables: [receivable({ vl_amount: 5000, vl_day: 5 })],
      expenses: [expense({ vl_amount: 1200, vl_day: 10 })],
    });

    expect(balanceOn(daily, 4)).toBe(1000);
    expect(balanceOn(daily, 5)).toBe(6000);
    expect(balanceOn(daily, 9)).toBe(6000);
    expect(balanceOn(daily, 10)).toBe(4800);
    expect(balanceOn(daily, 30)).toBe(4800);
  });

  it("moves day 31 to the last day of a 30-day month", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      expenses: [expense({ vl_amount: 100, vl_day: 31 })],
    });
    expect(balanceOn(daily, 29)).toBe(1000);
    expect(balanceOn(daily, 30)).toBe(900);
  });

  it("skips items outside their frequency window", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      days: daysUntilEndOfMonth(startDate, 1),
      receivables: [receivable({ vl_amount: 500, vl_day: 5, dt_start_month: "2026-12-01" })],
      extraExpenses: [
        extraExpense({ vl_amount: 300, vl_day: 15, nr_months: 1, dt_start_month: "2026-11-01" }),
      ],
    });

    expect(balanceOn(daily, 5)).toBe(1000);
    expect(balanceOn(daily, 15)).toBe(700);
    // December: the receivable starts, the one-off extra expense is gone
    expect(daily[daily.length - 1].value).toBe(1200);
  });

  it("pays the card invoice plus recurring charges, moved from Saturday to Monday", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      creditCards: [card],
      creditCardBalances: [cardBalance],
      invoices: [invoice],
    });

    // 7 Nov 2026 is a Saturday, so the invoice is paid on Monday the 9th
    expect(balanceOn(daily, 7)).toBe(1000);
    expect(balanceOn(daily, 8)).toBe(1000);
    expect(balanceOn(daily, 9)).toBe(150);
  });

  it("still pays recurring charges when no invoice amount was launched", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      creditCards: [card],
      creditCardBalances: [cardBalance],
    });
    expect(balanceOn(daily, 9)).toBe(950);
  });

  it("rounds the projected balance", () => {
    const daily = simulateCashFlow({
      ...emptyInput,
      initialBalance: 10.4,
      expenses: [expense({ vl_amount: 0.3, vl_day: 3 })],
    });
    expect(balanceOn(daily, 2)).toBe(10);
    expect(balanceOn(daily, 3)).toBe(10);
  });
});

describe("chart points", () => {
  const daily = simulateCashFlow({
    ...emptyInput,
    days: daysUntilEndOfMonth(startDate, 1),
    receivables: [receivable({ vl_amount: 2000, vl_day: 5 })],
    expenses: [expense({ vl_amount: 1500, vl_day: 3 })],
  });

  it("labels daily points as dd/mm", () => {
    const [first] = toDailyPoints(daily);
    expect(first).toEqual({ date: "02/11", value: 1000 });
  });

  it("groups by month with the closing and lowest balance", () => {
    const monthly = toMonthlyPoints(daily);
    expect(monthly).toHaveLength(2);
    expect(monthly[0]).toMatchObject({ value: 1500, minValue: -500 });
    expect(monthly[1]).toMatchObject({ value: 2000, minValue: 0 });
    expect(monthly[0].label).toMatch(/^nov/);
  });
});
