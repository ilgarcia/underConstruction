import { z } from "zod";
import { createCurrencySchema } from "@/helpers/currency";

export const creditCardSchema = z.object({
  ds_description: z.string().min(1, "A descrição é obrigatória"),
  dt_day_closing: z.number().min(1, "Dia inválido").max(31, "Dia inválido"),
  vl_day: z.number().min(1, "Dia inválido").max(31, "Dia inválido"),
  vl_balance: createCurrencySchema({ min: 0, minMessage: "O valor não pode ser negativo" }),
});

export type CreditCardInput = z.input<typeof creditCardSchema>;
export type CreditCardData = z.output<typeof creditCardSchema>;
