import { z } from "zod";
import { createCurrencySchema } from "@/helpers/currency";

export const transactionSchema = z.object({
  day_picker: z.number()
    .min(1, "Deve ser entre 1 e 31.")
    .max(31, "Deve ser entre 1 e 31."),
  description: z.string().min(1, "Descrição é obrigatória."),
  value: createCurrencySchema({ min: 0, minMessage: "O valor deve ser maior que 0." }),
  // Only used when the manager has a frequency (receivables, extra expenses)
  frequency: z.enum(["always", "months"]),
  nr_months: z.number().int().min(1, "Mínimo de 1 mês."),
  dt_start_month: z.string().regex(/^\d{4}-\d{2}-01$/, "Escolha o mês."),
});

export type TransactionInput = z.input<typeof transactionSchema>;
export type TransactionData = z.output<typeof transactionSchema>;
