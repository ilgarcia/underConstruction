import { createTransactionStore } from "./transaction-factory";
import type { MonthlyFrequency } from "@/helpers/month";

export interface ExtraExpenseRecord extends MonthlyFrequency {
  id_extra_expense: string;
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

export const useExtraExpenseStore = createTransactionStore<ExtraExpenseRecord>(
  "/api/cash-flow/extra-expense",
);

