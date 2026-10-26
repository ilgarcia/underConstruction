import {
  addMonths,
  describeFrequency,
  isActiveInMonth,
  monthDiff,
  parseMonthKey,
  toFrequency,
  toMonthKey,
} from "./month";

describe("month keys", () => {
  it("formats a date as the first day of its month", () => {
    expect(toMonthKey(new Date(2026, 0, 31))).toBe("2026-01-01");
    expect(toMonthKey(new Date(2026, 11, 5))).toBe("2026-12-01");
  });

  it("parses a key into a local date on the first day", () => {
    const date = parseMonthKey("2026-03-01");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(1);
  });

  it("adds months across year boundaries", () => {
    expect(addMonths("2026-11-01", 3)).toBe("2027-02-01");
    expect(addMonths("2026-01-01", -1)).toBe("2025-12-01");
  });

  it("counts months between two keys", () => {
    expect(monthDiff("2026-10-01", "2027-01-01")).toBe(3);
    expect(monthDiff("2027-01-01", "2026-10-01")).toBe(-3);
  });
});

describe("isActiveInMonth", () => {
  it("applies every month from the start when nr_months is null", () => {
    const item = { dt_start_month: "2026-10-01", nr_months: null };
    expect(isActiveInMonth(item, "2026-09-01")).toBe(false);
    expect(isActiveInMonth(item, "2026-10-01")).toBe(true);
    expect(isActiveInMonth(item, "2030-01-01")).toBe(true);
  });

  it("stops after nr_months months", () => {
    const item = { dt_start_month: "2026-11-01", nr_months: 3 };
    expect(isActiveInMonth(item, "2026-11-01")).toBe(true);
    expect(isActiveInMonth(item, "2027-01-01")).toBe(true);
    expect(isActiveInMonth(item, "2027-02-01")).toBe(false);
  });
});

describe("describeFrequency", () => {
  it("describes items that repeat every month", () => {
    expect(describeFrequency({ dt_start_month: "2026-11-01", nr_months: null })).toMatch(
      /^Todo mês · desde nov/,
    );
  });

  it("describes a single month and a range of months", () => {
    expect(describeFrequency({ dt_start_month: "2026-11-01", nr_months: 1 })).toMatch(/^1 mês · /);
    expect(describeFrequency({ dt_start_month: "2026-12-01", nr_months: 3 })).toMatch(
      /^3 meses · dez.* a fev/,
    );
  });
});

describe("toFrequency", () => {
  it("keeps a valid start month and a positive month count", () => {
    expect(toFrequency({ dt_start_month: "2026-11-01", nr_months: "4" })).toEqual({
      dt_start_month: "2026-11-01",
      nr_months: 4,
    });
  });

  it("drops an invalid start month and treats a bad count as every month", () => {
    expect(toFrequency({ dt_start_month: "2026-11-15", nr_months: 0 })).toEqual({
      nr_months: null,
    });
    expect(toFrequency({ nr_months: 1.5 })).toEqual({ nr_months: null });
  });
});
