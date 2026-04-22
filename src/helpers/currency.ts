import { z } from "zod";

interface CurrencySchemaOptions {
  min?: number;
  minMessage?: string;
  requiredMessage?: string;
}

/**
 * Creates a Zod schema for currency validation.
 * Handles strings in Brazilian format (e.g., "1.234,50") and numbers.
 *
 * @param options - Validation options (min value, custom messages)
 * @returns A Zod transform/refine schema
 */
function createCurrencySchema({
  min,
  minMessage,
  requiredMessage = "O valor não pode ser vazio.",
}: CurrencySchemaOptions = {}) {
  return z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "number") return val;
      if (val.trim() === "") return 0;

      // Convert "1.234,50" to "1234.50"
      const parsed = parseFloat(val.replace(/\./g, "").replace(",", "."));
      return isNaN(parsed) ? 0 : parsed;
    })
    .refine((val) => val !== null && val !== undefined, {
      message: requiredMessage,
    })
    .refine(
      (val) => {
        if (min !== undefined) {
          return val > min;
        }
        return true;
      },
      {
        message: minMessage || `O valor deve ser maior que ${min}.`,
      }
    );
}

/**
 * Formats a number as a Brazilian real (BRL) currency string.
 *
 * @param value - The numeric value to format
 * @returns A formatted currency string (e.g., "R$ 1.234,50")
 */
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Exports
export { createCurrencySchema, formatCurrency };
