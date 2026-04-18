import { z } from "zod";
import { currencySchema } from "../schema";

export const receivablesSchema = z.object({
  day_picker: z.number()
    .min(1, "Deve ser entre 1 e 31.")
    .max(31, "Deve ser entre 1 e 31."),
  description: z.string().min(1, "A descrição é obrigatória."),
  value: currencySchema,
  // value: currencySchema.pipe(z.number().min(0.01, "O valor não pode estar zerado.")),
});

export type ReceivablesInput = z.input<typeof receivablesSchema>;
export type ReceivablesData = z.output<typeof receivablesSchema>;
