import { z } from "zod";

// Helper to coerce string values (like "1.234,50" or "1000") to number robustly.
// ActionInput format produces string like "1.234,50" when type="currency"
// We need to parse that string into a number if it comes as a string.
const currencySchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    if (typeof val === "number") return val;
    if (val.trim() === "") return 0;
    
    // Convert "1.234,50" to "1234.50"
    const parsed = parseFloat(
      val.replace(/\./g, "").replace(",", ".")
    );
    return isNaN(parsed) ? 0 : parsed;
  })
  .refine((val) => val !== null && val !== undefined, {
    message: "O valor não pode ser vazio.",
  });

export const quickTransactionSchema = z.object({
  balance: currencySchema,
  invoice: currencySchema,
  accounts: currencySchema.optional(),
  receivables: currencySchema.optional(),
});

export type QuickTransactionInput = z.input<typeof quickTransactionSchema>;
export type QuickTransactionData = z.output<typeof quickTransactionSchema>;
