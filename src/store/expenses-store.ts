import { createTransactionStore } from "./transaction-factory";

export interface ExpensesRecord {
  id_expense: string;
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

export const useExpensesStore = createTransactionStore<ExpensesRecord>("/api/cash-flow/expenses");

