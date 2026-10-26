import { transactionSchema, type TransactionInput } from "./schema";

const valid: TransactionInput = {
  day_picker: 5,
  description: "Salário",
  value: "3.200,00",
  frequency: "always",
  nr_months: 1,
  dt_start_month: "2026-11-01",
};

const messagesFor = (input: TransactionInput): string[] => {
  const result = transactionSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("transactionSchema", () => {
  it("accepts a valid transaction and parses the amount", () => {
    expect(transactionSchema.parse(valid).value).toBe(3200);
  });

  it("requires a description and a positive amount", () => {
    expect(messagesFor({ ...valid, description: "", value: "0,00" })).toEqual([
      "Descrição é obrigatória.",
      "O valor deve ser maior que 0.",
    ]);
  });

  it("limits the day to 1-31", () => {
    expect(messagesFor({ ...valid, day_picker: 0 })).toEqual(["Deve ser entre 1 e 31."]);
    expect(messagesFor({ ...valid, day_picker: 32 })).toEqual(["Deve ser entre 1 e 31."]);
  });

  it("requires a start month on the first day and at least one month", () => {
    expect(messagesFor({ ...valid, dt_start_month: "2026-11-15" })).toEqual(["Escolha o mês."]);
    expect(messagesFor({ ...valid, nr_months: 0 })).toEqual(["Mínimo de 1 mês."]);
  });
});
