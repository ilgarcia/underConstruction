import type { Control } from "react-hook-form";
import type { TransactionData, TransactionInput } from "../schema";

export interface FrequencyFieldsProps {
  control: Control<TransactionInput, undefined, TransactionData>;
  /** Start month of the item being edited, kept in the options even if it already passed. */
  editingStartMonth?: string;
}
