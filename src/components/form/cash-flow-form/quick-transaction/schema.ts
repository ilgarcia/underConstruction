import { z } from "zod";
import { createCurrencySchema } from "@/helpers/currency";

export const quickTransactionSchema = z.object({
  balance: createCurrencySchema(),
  invoice: createCurrencySchema(),
  expenses: createCurrencySchema().optional(),
  receivables: createCurrencySchema().optional(),
});

export type QuickTransactionInput = z.input<typeof quickTransactionSchema>;
export type QuickTransactionData = z.output<typeof quickTransactionSchema>;
