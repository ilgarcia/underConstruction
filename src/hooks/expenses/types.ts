import { BaseTransactionRecord, CreateTransactionParams } from "@/store/transaction-factory";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ExpensesRecord extends BaseTransactionRecord {
  id_expense: string;
}

interface UseExpensesCreateResult {
  isCreating: boolean;
  error: string | null;
  createExpenses: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<ExpensesRecord | ExpensesRecord[]>;
}

interface UseExpensesDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteExpenses: (ids: string[]) => Promise<void>;
}

interface UseExpensesUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateExpenses: (params: {
    id_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }) => Promise<ExpensesRecord>;
}

interface UseExpensesListResult {
  expenses: ExpensesRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseExpensesManagerResult extends TransactionManagerStore {
  items: ExpensesRecord[];
}

export type {
  ExpensesRecord,
  UseExpensesCreateResult,
  UseExpensesDeleteResult,
  UseExpensesUpdateResult,
  UseExpensesListResult,
  UseExpensesManagerResult,
};
