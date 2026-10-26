import { dayInMonth, getUpcomingInvoices } from "./invoice";

describe("dayInMonth", () => {
  it("clamps the day to the last day of shorter months", () => {
    expect(dayInMonth(2026, 1, 31).getDate()).toBe(28);
    expect(dayInMonth(2028, 1, 31).getDate()).toBe(29);
    expect(dayInMonth(2026, 3, 31).getDate()).toBe(30);
  });

  it("keeps days that exist in the month", () => {
    expect(dayInMonth(2026, 0, 15)).toEqual(new Date(2026, 0, 15));
  });
});

describe("getUpcomingInvoices", () => {
  it("starts with this month's invoice when it is still ahead", () => {
    // 10 Nov 2026 is a Tuesday
    const invoices = getUpcomingInvoices(10, new Date(2026, 10, 2), 2);
    expect(invoices.map((i) => i.monthKey)).toEqual(["2026-11-01", "2026-12-01"]);
    expect(invoices[0].dueDate).toEqual(new Date(2026, 10, 10));
  });

  it("skips an invoice already due before the start date", () => {
    const invoices = getUpcomingInvoices(5, new Date(2026, 10, 20), 1);
    expect(invoices[0].monthKey).toBe("2026-12-01");
  });

  it("moves a weekend due date to Monday", () => {
    // 1 Nov 2026 is a Sunday
    const [invoice] = getUpcomingInvoices(1, new Date(2026, 9, 26), 1);
    expect(invoice.monthKey).toBe("2026-11-01");
    expect(invoice.dueDate).toEqual(new Date(2026, 10, 2));
  });
});
