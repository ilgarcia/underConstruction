import { z } from "zod";
import { createCurrencySchema } from "@/helpers/currency";

export const transactionSchema = z.object({
  day_picker: z.number()
    .min(1, "Deve ser entre 1 e 31.")
    .max(31, "Deve ser entre 1 e 31."),
  description: z.string().min(1, "Descrição é obrigatória."),
  value: createCurrencySchema({ min: 0, minMessage: "O valor deve ser maior que 0." }),
});

export type TransactionInput = z.input<typeof transactionSchema>;
export type TransactionData = z.output<typeof transactionSchema>;
