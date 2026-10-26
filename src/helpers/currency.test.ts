import { createCurrencySchema, formatCurrency, parseCurrency } from "./currency";

describe("parseCurrency", () => {
  it("parses Brazilian formatted amounts", () => {
    expect(parseCurrency("1.234,50")).toBe(1234.5);
    expect(parseCurrency("0,99")).toBe(0.99);
  });

  it("returns numbers as they are and 0 for garbage", () => {
    expect(parseCurrency(42)).toBe(42);
    expect(parseCurrency("abc")).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("formats as BRL", () => {
    expect(formatCurrency(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
  });
});

describe("createCurrencySchema", () => {
  const schema = createCurrencySchema({ min: 0, minMessage: "O valor deve ser maior que 0." });

  it("transforms formatted strings into numbers", () => {
    expect(schema.parse("2.500,00")).toBe(2500);
  });

  it("rejects values at or below the minimum", () => {
    const result = schema.safeParse("0,00");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("O valor deve ser maior que 0.");
  });
});
