import { z } from "zod";
import { createCurrencySchema } from "@/helpers/currency";

export const receivablesSchema = z.object({
  day_picker: z.number()
    .min(1, "Deve ser entre 1 e 31.")
    .max(31, "Deve ser entre 1 e 31."),
  description: z.string().min(1, "A descrição é obrigatória."),
  value: createCurrencySchema({ min: 0, minMessage: "O valor deve ser maior que 0." }),
});

export type ReceivablesInput = z.input<typeof receivablesSchema>;
export type ReceivablesData = z.output<typeof receivablesSchema>;
