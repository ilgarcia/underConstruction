import type { BaseTransactionRecord, CreateFrequencyParams } from "@/store/transaction-factory";
import type { MonthlyFrequency } from "@/helpers/month";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ExtraExpenseRecord extends BaseTransactionRecord, MonthlyFrequency {
  id_extra_expense: string;
}

interface UseExtraExpenseCreateResult {
  isCreating: boolean;
  error: string | null;
  createExtraExpense: (
    params: CreateFrequencyParams | CreateFrequencyParams[],
  ) => Promise<ExtraExpenseRecord | ExtraExpenseRecord[]>;
}

interface UseExtraExpenseDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteExtraExpenses: (ids: string[]) => Promise<void>;
}

interface UseExtraExpenseUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateExtraExpense: (params: {
    id_extra_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
    dt_start_month?: string;
    nr_months?: number | null;
  }) => Promise<ExtraExpenseRecord>;
}

interface UseExtraExpenseListResult {
  extraExpenses: ExtraExpenseRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseExtraExpensesManagerResult extends TransactionManagerStore {
  items: ExtraExpenseRecord[];
}

export type {
  ExtraExpenseRecord,
  UseExtraExpenseCreateResult,
  UseExtraExpenseDeleteResult,
  UseExtraExpenseUpdateResult,
  UseExtraExpenseListResult,
  UseExtraExpensesManagerResult,
};
